/** @type {import('i18n-unused').RunOptions} */
module.exports = {
    localesPath: 'src/lang',
    srcPath: 'src',
    /**
     * Match formatMessage calls
     *
     * ```ts
     * const value = intl.formatMessage({ id: key })
     * ```
     */
    translationKeyMatcher: /(?:[$ .](formatMessage\()\s*\{\s*id:\s*).*?(?:\s*\})/gi
  };
