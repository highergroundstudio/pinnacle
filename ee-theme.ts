
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin'

export const eeTheme: CustomThemeConfig = {
    name: 'eeTheme',
    properties: {
        // =~= Theme Properties =~=
        "--theme-font-family-base": `system-ui`,
        "--theme-font-family-heading": `system-ui`,
        "--theme-font-color-base": "0 0 0",
        "--theme-font-color-dark": "255 255 255",
        "--theme-rounded-base": "8px",
        "--theme-rounded-container": "4px",
        "--theme-border-base": "2px",
        // =~= Theme On-X Colors =~=
        "--on-primary": "0 0 0",
        "--on-secondary": "0 0 0",
        "--on-tertiary": "255 255 255",
        "--on-success": "0 0 0",
        "--on-warning": "0 0 0",
        "--on-error": "0 0 0",
        "--on-surface": "255 255 255",
        // =~= Theme Colors  =~=
        // primary | #BFD11D 
        "--color-primary-50": "245 248 221", // #f5f8dd
        "--color-primary-100": "242 246 210", // #f2f6d2
        "--color-primary-200": "239 244 199", // #eff4c7
        "--color-primary-300": "229 237 165", // #e5eda5
        "--color-primary-400": "210 223 97", // #d2df61
        "--color-primary-500": "191 209 29", // #BFD11D
        "--color-primary-600": "172 188 26", // #acbc1a
        "--color-primary-700": "143 157 22", // #8f9d16
        "--color-primary-800": "115 125 17", // #737d11
        "--color-primary-900": "94 102 14", // #5e660e
        // secondary | #E0E437 
        "--color-secondary-50": "250 251 225", // #fafbe1
        "--color-secondary-100": "249 250 215", // #f9fad7
        "--color-secondary-200": "247 248 205", // #f7f8cd
        "--color-secondary-300": "243 244 175", // #f3f4af
        "--color-secondary-400": "233 236 115", // #e9ec73
        "--color-secondary-500": "224 228 55", // #E0E437
        "--color-secondary-600": "202 205 50", // #cacd32
        "--color-secondary-700": "168 171 41", // #a8ab29
        "--color-secondary-800": "134 137 33", // #868921
        "--color-secondary-900": "110 112 27", // #6e701b
        // tertiary | #4E6201 
        "--color-tertiary-50": "228 231 217", // #e4e7d9
        "--color-tertiary-100": "220 224 204", // #dce0cc
        "--color-tertiary-200": "211 216 192", // #d3d8c0
        "--color-tertiary-300": "184 192 153", // #b8c099
        "--color-tertiary-400": "131 145 77", // #83914d
        "--color-tertiary-500": "78 98 1", // #4E6201
        "--color-tertiary-600": "70 88 1", // #465801
        "--color-tertiary-700": "59 74 1", // #3b4a01
        "--color-tertiary-800": "47 59 1", // #2f3b01
        "--color-tertiary-900": "38 48 0", // #263000
        // success | #BFD11D 
        "--color-success-50": "245 248 221", // #f5f8dd
        "--color-success-100": "242 246 210", // #f2f6d2
        "--color-success-200": "239 244 199", // #eff4c7
        "--color-success-300": "229 237 165", // #e5eda5
        "--color-success-400": "210 223 97", // #d2df61
        "--color-success-500": "191 209 29", // #BFD11D
        "--color-success-600": "172 188 26", // #acbc1a
        "--color-success-700": "143 157 22", // #8f9d16
        "--color-success-800": "115 125 17", // #737d11
        "--color-success-900": "94 102 14", // #5e660e
        // warning | #F5A623 
        "--color-warning-50": "254 242 222", // #fef2de
        "--color-warning-100": "253 237 211", // #fdedd3
        "--color-warning-200": "253 233 200", // #fde9c8
        "--color-warning-300": "251 219 167", // #fbdba7
        "--color-warning-400": "248 193 101", // #f8c165
        "--color-warning-500": "245 166 35", // #F5A623
        "--color-warning-600": "221 149 32", // #dd9520
        "--color-warning-700": "184 125 26", // #b87d1a
        "--color-warning-800": "147 100 21", // #936415
        "--color-warning-900": "120 81 17", // #785111
        // error | #E57373 
        "--color-error-50": "251 234 234", // #fbeaea
        "--color-error-100": "250 227 227", // #fae3e3
        "--color-error-200": "249 220 220", // #f9dcdc
        "--color-error-300": "245 199 199", // #f5c7c7
        "--color-error-400": "237 157 157", // #ed9d9d
        "--color-error-500": "229 115 115", // #E57373
        "--color-error-600": "206 104 104", // #ce6868
        "--color-error-700": "172 86 86", // #ac5656
        "--color-error-800": "137 69 69", // #894545
        "--color-error-900": "112 56 56", // #703838
        // surface | #303745 
        "--color-surface-50": "224 225 227", // #e0e1e3
        "--color-surface-100": "214 215 218", // #d6d7da
        "--color-surface-200": "203 205 209", // #cbcdd1
        "--color-surface-300": "172 175 181", // #acafb5
        "--color-surface-400": "110 115 125", // #6e737d
        "--color-surface-500": "48 55 69", // #303745
        "--color-surface-600": "43 50 62", // #2b323e
        "--color-surface-700": "36 41 52", // #242934
        "--color-surface-800": "29 33 41", // #1d2129
        "--color-surface-900": "24 27 34", // #181b22

    }
}