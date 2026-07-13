import { ConfigPlugin, withDangerousMod } from "@expo/config-plugins"
import * as fs from "fs"
import * as path from "path"

/**
 * Copies XML vector drawables from assets/icons into Android drawable resources.
 */
const withAndroidDrawable: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    "android",
    (config) => {
      const drawableDir = path.join(
        config.modRequest.platformProjectRoot,
        "app",
        "src",
        "main",
        "res",
        "drawable",
      )

      if (!fs.existsSync(drawableDir)) {
        fs.mkdirSync(drawableDir, { recursive: true })
      }

      const iconsDir = path.join(config.modRequest.projectRoot, "assets", "icons")
      if (!fs.existsSync(iconsDir)) return config

      const xmlFiles = fs.readdirSync(iconsDir).filter((f) => f.endsWith(".xml"))
      for (const file of xmlFiles) {
        fs.copyFileSync(path.join(iconsDir, file), path.join(drawableDir, file))
      }

      return config
    },
  ])
}

export default withAndroidDrawable
