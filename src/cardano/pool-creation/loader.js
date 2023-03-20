class MultiPlatformLoader {
  async load() {
    if (this._wasm) return
    /**
     * @private
     */
    this._wasm = await import(
      // 'cardano-serialization-lib'
      '@dcspark/cardano-multiplatform-lib-browser/cardano_multiplatform_lib'
      // '@emurgo/cardano-serialization-lib-browser'
    )
  }

  get Cardano() {
    return this._wasm
  }
}

export default new MultiPlatformLoader()
