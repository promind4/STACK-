
import { execSync } from 'child_process';

const products = [
    { name: "KRK Rokit RP5 G4", candidates: ["krk_rokit_rp5_g4.htm", "krk_rokit_rp5_g4_studiomonitor.htm"] },
    { name: "JBL 305P MKII", candidates: ["jbl_305p_mkii.htm", "jbl_305_p_mkii.htm", "jbl_lsr_305_p_mkii.htm"] },
    { name: "Mackie CR3-X", candidates: ["mackie_cr3_x.htm", "mackie_cr3_x_pair.htm", "mackie_cr3x.htm"] },
    { name: "Focusrite Scarlett 2i2 4th Gen", candidates: ["focusrite_scarlett_2i2_4th_gen.htm", "focusrite_scarlett_2i2_4th.htm"] },
    { name: "SSL 2+", candidates: ["ssl_2_plus.htm", "ssl_2.htm", "solid_state_logic_ssl_2.htm", "solid_state_logic_ssl2_plus.htm"] },
    { name: "Steinberg UR22C", candidates: ["steinberg_ur22c.htm", "steinberg_ur_22_c.htm", "steinberg_ur22_cmk2.htm"] },
    { name: "PreSonus Studio 24c", candidates: ["presonus_studio_24c.htm", "presonus_studio_24_c.htm", "presonus_studio_24.htm"] },
    { name: "Behringer UMC202HD", candidates: ["behringer_umc202hd.htm", "behringer_u_phoria_umc202hd.htm"] },
    { name: "Sennheiser HD 600", candidates: ["sennheiser_hd_600.htm", "sennheiser_hd600.htm", "sennheiser_hd_600_new_version_2019.htm", "sennheiser_hd_600_2019.htm"] },
    { name: "Sennheiser HD 280 Pro", candidates: ["sennheiser_hd280_pro.htm", "sennheiser_hd_280_pro.htm", "sennheiser_hd_280_pro_new.htm"] },
    { name: "sE Electronics DM1 Dynamite", candidates: ["se_electronics_dm1_dynamite.htm", "se_electronics_dm1.htm", "se_electronics_dm_1.htm"] },
    { name: "Klark Teknik Mic Booster CT 1", candidates: ["klark_teknik_mic_booster_ct_1.htm", "klark_teknik_mic_booster_ct1.htm", "klark_teknik_ct1.htm"] },
    { name: "ART Tube MP", candidates: ["art_tube_mp.htm", "art_tubemp.htm"] }
];

const BASE_URL = "https://www.thomann.de/fr/";

console.log("Checking valid URLs...");

products.forEach(p => {
    let found = false;
    for (const slug of p.candidates) {
        const url = BASE_URL + slug;
        try {
            // Use curl to check head
            // Need --head or -I
            // Timeout 5s
            // On Windows PowerShell, 'curl' is Invoke-WebRequest alias sometimes.
            // Use 'curl.exe' to be safe? Or simple node fetch?
            // Node fetch is better.
            const cmd = `curl.exe -I -s -o NUL -w "%{http_code}" "${url}"`;
            const code = execSync(cmd, { timeout: 5000 }).toString().trim();

            if (code === "200") {
                console.log(`✅ ${p.name}: ${url}`);
                found = true;
                break;
            } else {
                // console.log(`   ❌ ${slug} (${code})`);
            }
        } catch (e) {
            // console.log(`   ⚠️ Error checking ${slug}`);
        }
    }
    if (!found) console.log(`❌ ${p.name}: No valid URL found.`);
});
