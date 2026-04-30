import { ConfigPlugin, withDangerousMod } from "@expo/config-plugins"
import * as fs from "fs"
import * as path from "path"

/**
 * Patches the expo-sharing share extension's ShareIntoViewController.swift:
 * 1. Tries both dev client (exp+<scheme>) and production (<scheme>) URL schemes
 * 2. Works around iOS 26 beta SLComposeServiceViewController crash
 *    (NSInternalInconsistencyException in _UINavigationBarTitleControl)
 *    https://developer.apple.com/forums/thread/805268
 */
const withShareExtensionDevClient: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    "ios",
    (config) => {
      const swiftPath = path.join(
        config.modRequest.platformProjectRoot,
        "expo-sharing-extension",
        "ShareIntoViewController.swift",
      )

      if (!fs.existsSync(swiftPath)) return config

      let contents = fs.readFileSync(swiftPath, "utf-8")

      // Replace the openParentApp method to try both schemes
      const original = `  @MainActor
  func openParentApp() {
    guard let url = URL(string: "\\(hostAppScheme)://expo-sharing") else {
      fatalError("The app scheme \\(hostAppScheme) is invalid - it is not possible to create a valid deep link URL with it")
    }

    openURL(url)
    self.close()
  }`

      const patched = `  @MainActor
  func openParentApp() {
    // Try dev client scheme first (exp+<scheme>), then production scheme
    if let devUrl = URL(string: "exp+\\(hostAppScheme)://expo-sharing") {
      openURL(devUrl)
    }
    if let prodUrl = URL(string: "\\(hostAppScheme)://expo-sharing") {
      openURL(prodUrl)
    }
    self.close()
  }`

      if (contents.includes(original)) {
        contents = contents.replace(original, patched)
      }

      // Workaround for iOS 26 beta crash in SLComposeServiceViewController
      // https://developer.apple.com/forums/thread/805268
      const lifecycleMarker = "override func viewWillAppear(_ animated: Bool) {"
      const ios26Fix = `  override func isContentValid() -> Bool {
    if #available(iOS 26, *) {
      self.navigationController?.isNavigationBarHidden = true
    }
    return true
  }

  override func viewWillAppear(_ animated: Bool) {`

      if (contents.includes(lifecycleMarker) && !contents.includes("isContentValid")) {
        contents = contents.replace(lifecycleMarker, ios26Fix)
      }

      fs.writeFileSync(swiftPath, contents)

      return config
    },
  ])
}

export default withShareExtensionDevClient
