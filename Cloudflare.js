// ==UserScript==
// @name         Autopass Cloudflare CAPTCHA
// @namespace    Violentmonkey Scripts
// @version      1.0.0
// @description  Automatically bypass Cloudflare CAPTCHA challenges.
// @author       Ravi Rizaei
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @require      https://greasyfork.org/scripts/464929-module-jquery-xiaoying/code/module_jquery_XiaoYing.js
// @require      https://greasyfork.org/scripts/464780-global-module/code/global_module.js
// @icon         https://www.google.com/s2/favicons?sz=48&domain=cloudflare.com
// @icon64       https://www.google.com/s2/favicons?sz=64&domain=cloudflare.com
// @downloadURL  https://update.greasyfork.org/scripts/464785/Autopass%20Cloudflare%20CAPTCHA.user.js
// @updateURL    https://update.greasyfork.org/scripts/464785/Autopass%20Cloudflare%20CAPTCHA.meta.js
// ==/UserScript==

// Import the global module for utility functions
const global_module = window['global_module'];

/**
 * Handles CAPTCHA challenges with "Verify you are human" button.
 */
async function VerifyYouAreHuman_01() {
    const dom = await global_module.waitForElement("input[value='Verify you are human'][type='button']", null, null, 200, -1);
    global_module.clickElement($(dom).eq(0)[0]);
}

/**
 * Handles CAPTCHA challenges with checkboxes and additional markers.
 */
async function VerifyYouAreHuman_02() {
    let dom = await global_module.waitForElement("input[type='checkbox']", null, null, 200, -1);
    global_module.clickElement($(dom).eq(0)[0]);
    dom = await global_module.waitForElement("span[class='mark']", null, null, 200, -1);
    global_module.clickElement($(dom).eq(0)[0]);
}

/**
 * Handles CAPTCHA challenges similar to VerifyYouAreHuman_01.
 */
async function VerifyYouAreHuman_03() {
    const dom = await global_module.waitForElement("input[value='Verify you are human'][type='button']", null, null, 200, -1);
    global_module.clickElement($(dom).eq(0)[0]);
}

/**
 * Main function to detect and resolve Cloudflare CAPTCHA challenges.
 */
async function main() {
    const ray_id = $("div[class='ray-id']"); // Cloudflare ray ID container
    const hrefdom = $("a[href*='cloudflare.com'][target='_blank']"); // Cloudflare-specific links

    // Scenario 1: Check for ray ID and Cloudflare link
    if (ray_id.length > 0 && hrefdom.length > 0) {
        VerifyYouAreHuman_01();
        return;
    }

    // Scenario 2: Cloudflare success/failure screen on challenge domain
    if (window.location.host === 'challenges.cloudflare.com' &&
        $("div[id='success']").length > 0 &&
        $("div[id='fail']").length > 0 &&
        $("div[id='expired']").length > 0) {
        VerifyYouAreHuman_02();
        return;
    }

    // Scenario 3: Cloudflare challenge logo detected
    if ($('div[class="logo"]').length > 0) {
        VerifyYouAreHuman_03();
        return;
    }
}

// Run the main function when the document is ready
$(document).ready(() => main());
