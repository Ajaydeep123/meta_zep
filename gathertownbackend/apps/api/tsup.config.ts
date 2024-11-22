import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entryPoints: ["src/index.ts"],
  clean: true,
  format: ["cjs"],  //add "esm" here and in dev/build script, if need to support it
  ...options,
}));
