// @ts-check
/** @type {import('stylelint').Config} */
export default {
  extends: [
    "stylelint-config-standard-scss"
  ],
  plugins: [
    "stylelint-scss"
  ],
  rules: {
    "rule-empty-line-before": null, // 👈 Disable empty line requirement
    "selector-class-pattern": null,
    "no-descending-specificity": null,
    "scss/dollar-variable-pattern":  "^[a-z][a-z0-9]*(-[a-z0-9]+)*$",
    "scss/at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "forward",
          "use",
          "mixin",
          "include",
          "if",
          "else"
        ]
      }
    ],
    "selector-pseudo-class-no-unknown": [
      true,
      { ignorePseudoClasses: ["global", "local"] }
    ]
  },
  ignoreFiles: [
    "**/node_modules/**",
    "dist/**",
    "**/*.config.{js,ts}"
  ]
};