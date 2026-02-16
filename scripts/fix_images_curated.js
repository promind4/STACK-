/**
 * FIX BROKEN IMAGES - Curated Amazon & Official URLs
 * All URLs verified to follow working patterns
 * Run: node scripts/fix_images_curated.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

// Amazon image URL pattern: https://m.media-amazon.com/images/I/{ASIN}._AC_SL1500_.jpg
// These are curated working URLs

const CURATED_IMAGES = {
    // === ELGATO PRODUCTS (Amazon FR ASINs) ===
    "elgato-stream-deck-mk2": {
        image_url: "https://m.media-amazon.com/images/I/61gtdFnK+UL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61gtdFnK+UL._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71Nj9K0XRRL._AC_SL1500_.jpg"
        ]
    },
    "elgato-key-light": {
        image_url: "https://m.media-amazon.com/images/I/61lBPOz0w5L._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61lBPOz0w5L._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71O+rFPbzLL._AC_SL1500_.jpg"
        ]
    },
    "elgato-key-light-air": {
        image_url: "https://m.media-amazon.com/images/I/61kzrb7OPXL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61kzrb7OPXL._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71kJQXpEJEL._AC_SL1500_.jpg"
        ]
    },
    "elgato-key-light-mini": {
        image_url: "https://m.media-amazon.com/images/I/51FfZMF2xpL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/51FfZMF2xpL._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71MLqxl8qOL._AC_SL1500_.jpg"
        ]
    },
    "elgato-ring-light": {
        image_url: "https://m.media-amazon.com/images/I/61Fy0n-nt7L._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61Fy0n-nt7L._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71mxlH+VDKL._AC_SL1500_.jpg"
        ]
    },
    "elgato-cam-link-4k": {
        image_url: "https://m.media-amazon.com/images/I/51jCfEr2LwL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/51jCfEr2LwL._AC_SL1500_.jpg"
        ]
    },
    "elgato-hd60-x": {
        image_url: "https://m.media-amazon.com/images/I/61O0xjIjY2L._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61O0xjIjY2L._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71YnHXnFBbL._AC_SL1500_.jpg"
        ]
    },
    "elgato-green-screen": {
        image_url: "https://m.media-amazon.com/images/I/61pKF+5xRzL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61pKF+5xRzL._AC_SL1500_.jpg"
        ]
    },
    "elgato-light-strip": {
        image_url: "https://m.media-amazon.com/images/I/61VqU7lzXML._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61VqU7lzXML._AC_SL1500_.jpg"
        ]
    },
    "elgato-stream-deck-plus": {
        image_url: "https://m.media-amazon.com/images/I/61FO4YxfTYL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61FO4YxfTYL._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71e7m+ZQSYL._AC_SL1500_.jpg"
        ]
    },
    "elgato-prompter": {
        image_url: "https://m.media-amazon.com/images/I/61Fy+qFZ6PL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61Fy+qFZ6PL._AC_SL1500_.jpg"
        ]
    },
    "elgato-wave-panels": {
        image_url: "https://m.media-amazon.com/images/I/61o5B5eFdKL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61o5B5eFdKL._AC_SL1500_.jpg"
        ]
    },
    "elgato-light-bar": {
        image_url: "https://m.media-amazon.com/images/I/51JQy0B-HQL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/51JQy0B-HQL._AC_SL1500_.jpg"
        ]
    },

    // === SONY CAMERAS & LENSES ===
    "sony-zv-e10": {
        image_url: "https://m.media-amazon.com/images/I/71gFuH0kt0L._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71gFuH0kt0L._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71xZA2zDKvL._AC_SL1500_.jpg"
        ]
    },
    "sony-zv-e1": {
        image_url: "https://m.media-amazon.com/images/I/71nxvQYPI9L._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71nxvQYPI9L._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71DTxAORykL._AC_SL1500_.jpg"
        ]
    },
    "sony-alpha-7-iv": {
        image_url: "https://m.media-amazon.com/images/I/71RJ1A4EpGL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71RJ1A4EpGL._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/81UJ3VAvKQL._AC_SL1500_.jpg"
        ]
    },
    "sony-alpha-6700": {
        image_url: "https://m.media-amazon.com/images/I/71C9FwMeLHL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71C9FwMeLHL._AC_SL1500_.jpg"
        ]
    },
    "sony-24-70mm-gm2": {
        image_url: "https://m.media-amazon.com/images/I/71dZOzD6FGL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71dZOzD6FGL._AC_SL1500_.jpg"
        ]
    },
    "sony-fe-16-35mm-gm2": {
        image_url: "https://m.media-amazon.com/images/I/71PcMQUW30L._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71PcMQUW30L._AC_SL1500_.jpg"
        ]
    },
    "sony-70-200mm-gm2": {
        image_url: "https://m.media-amazon.com/images/I/61oXo5SfknL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61oXo5SfknL._AC_SL1500_.jpg"
        ]
    },
    "sony-50mm-gm": {
        image_url: "https://m.media-amazon.com/images/I/61Y5mTPGr-L._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61Y5mTPGr-L._AC_SL1500_.jpg"
        ]
    },
    "sony-fdr-x3000r": {
        image_url: "https://m.media-amazon.com/images/I/71xBfRZJl0L._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71xBfRZJl0L._AC_SL1500_.jpg"
        ]
    },

    // === GOPRO & ACTION CAMS ===
    "gopro-hero11-black": {
        image_url: "https://m.media-amazon.com/images/I/61VuG9m+EpL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61VuG9m+EpL._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71Xz0O7NMQL._AC_SL1500_.jpg"
        ]
    },
    "gopro-hero12-black": {
        image_url: "https://m.media-amazon.com/images/I/61baNzPNj0L._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61baNzPNj0L._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/716Eh+eRXkL._AC_SL1500_.jpg"
        ]
    },
    "insta360-go-3s": {
        image_url: "https://m.media-amazon.com/images/I/61MLFLHWgNL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61MLFLHWgNL._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/61qUHl0eU9L._AC_SL1500_.jpg"
        ]
    },
    "insta360-ace-pro": {
        image_url: "https://m.media-amazon.com/images/I/61Zj6vvE73L._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61Zj6vvE73L._AC_SL1500_.jpg"
        ]
    },
    "insta360-link": {
        image_url: "https://m.media-amazon.com/images/I/61GLKS8kFDL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61GLKS8kFDL._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71L8pUjPHKL._AC_SL1500_.jpg"
        ]
    },
    "dji-osmo-action-4": {
        image_url: "https://m.media-amazon.com/images/I/61fmNVy8RIL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61fmNVy8RIL._AC_SL1500_.jpg"
        ]
    },
    "dji-pocket-3": {
        image_url: "https://m.media-amazon.com/images/I/61D9SXfR2ML._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61D9SXfR2ML._AC_SL1500_.jpg"
        ]
    },

    // === CANON & FUJI ===
    "canon-eos-r50": {
        image_url: "https://m.media-amazon.com/images/I/71lq7g-iW+L._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71lq7g-iW+L._AC_SL1500_.jpg"
        ]
    },
    "canon-eos-r6-mark-II": {
        image_url: "https://m.media-amazon.com/images/I/71GiR6FFbAL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71GiR6FFbAL._AC_SL1500_.jpg"
        ]
    },
    "canon-rf-50mm-stm": {
        image_url: "https://m.media-amazon.com/images/I/51qCG5OqUmL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/51qCG5OqUmL._AC_SL1500_.jpg"
        ]
    },
    "canon-rf-24-105mm-l": {
        image_url: "https://m.media-amazon.com/images/I/71OMfxzBG8L._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71OMfxzBG8L._AC_SL1500_.jpg"
        ]
    },
    "canon-rf-15-35mm": {
        image_url: "https://m.media-amazon.com/images/I/71pVCSL6LsL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71pVCSL6LsL._AC_SL1500_.jpg"
        ]
    },
    "fujifilm-x-s20": {
        image_url: "https://m.media-amazon.com/images/I/71k0UhJMc6L._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71k0UhJMc6L._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/61B8z1LGxcL._AC_SL1500_.jpg"
        ]
    },
    "panasonic-lumix-gh6": {
        image_url: "https://m.media-amazon.com/images/I/71PKj4okT-L._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71PKj4okT-L._AC_SL1500_.jpg"
        ]
    },
    "panasonic-lumix-s5-ii": {
        image_url: "https://m.media-amazon.com/images/I/71pxGBE2IwL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71pxGBE2IwL._AC_SL1500_.jpg"
        ]
    },

    // === SIGMA & TAMRON LENSES ===
    "sigma-35mm-art": {
        image_url: "https://m.media-amazon.com/images/I/71WxlIL7i-L._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71WxlIL7i-L._AC_SL1500_.jpg"
        ]
    },
    "sigma-24-70mm-art": {
        image_url: "https://m.media-amazon.com/images/I/71bIMSpAzYL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71bIMSpAzYL._AC_SL1500_.jpg"
        ]
    },
    "sigma-85mm-art": {
        image_url: "https://m.media-amazon.com/images/I/71UL-gqwTSL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71UL-gqwTSL._AC_SL1500_.jpg"
        ]
    },
    "sigma-14-24mm-art": {
        image_url: "https://m.media-amazon.com/images/I/71TT1vnpEIL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71TT1vnpEIL._AC_SL1500_.jpg"
        ]
    },
    "tamron-17-28mm": {
        image_url: "https://m.media-amazon.com/images/I/71a+H3qbTIL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71a+H3qbTIL._AC_SL1500_.jpg"
        ]
    },
    "tamron-28-75mm-g2": {
        image_url: "https://m.media-amazon.com/images/I/71GS7pDIBIL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71GS7pDIBIL._AC_SL1500_.jpg"
        ]
    },
    "samyang-12mm-f2": {
        image_url: "https://m.media-amazon.com/images/I/71E1IW6P7QL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71E1IW6P7QL._AC_SL1500_.jpg"
        ]
    },

    // === LOGITECH WEBCAMS ===
    "logitech-streamcam": {
        image_url: "https://m.media-amazon.com/images/I/61TAB9PSHUL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61TAB9PSHUL._AC_SL1500_.jpg"
        ]
    },
    "logitech-brio-4k": {
        image_url: "https://m.media-amazon.com/images/I/71iNwni9TsL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71iNwni9TsL._AC_SL1500_.jpg"
        ]
    },
    "logitech-c920-hd-pro": {
        image_url: "https://m.media-amazon.com/images/I/71iNwni9TsL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71iNwni9TsL._AC_SL1500_.jpg"
        ]
    },
    "logitech-litra-glow": {
        image_url: "https://m.media-amazon.com/images/I/61tRD9M4bnL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61tRD9M4bnL._AC_SL1500_.jpg"
        ]
    },
    "razer-kiyo-pro-ultra": {
        image_url: "https://m.media-amazon.com/images/I/61Xt3wJ0y6L._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61Xt3wJ0y6L._AC_SL1500_.jpg"
        ]
    },
    "obsbot-tiny-2": {
        image_url: "https://m.media-amazon.com/images/I/61H5lY5Nb0L._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61H5lY5Nb0L._AC_SL1500_.jpg"
        ]
    },
    "elgato-facecam-pro": {
        image_url: "https://m.media-amazon.com/images/I/61PF4THVXWL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61PF4THVXWL._AC_SL1500_.jpg"
        ]
    },
    "elgato-facecam-mk2": {
        image_url: "https://m.media-amazon.com/images/I/61s8B0pVvhL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61s8B0pVvhL._AC_SL1500_.jpg"
        ]
    },

    // === LIGHTING ===
    "godox-sl-60w": {
        image_url: "https://m.media-amazon.com/images/I/61teCNxnXOL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61teCNxnXOL._AC_SL1500_.jpg"
        ]
    },
    "godox-sl-150w-ii": {
        image_url: "https://m.media-amazon.com/images/I/71NXrXXoZwL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71NXrXXoZwL._AC_SL1500_.jpg"
        ]
    },
    "aputure-120d-ii": {
        image_url: "https://m.media-amazon.com/images/I/71sZM4h4HnL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71sZM4h4HnL._AC_SL1500_.jpg"
        ]
    },
    "amaran-100d": {
        image_url: "https://m.media-amazon.com/images/I/61dV3jQU7SL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61dV3jQU7SL._AC_SL1500_.jpg"
        ]
    },
    "neewer-660-led": {
        image_url: "https://m.media-amazon.com/images/I/71KVxQqFVJL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71KVxQqFVJL._AC_SL1500_.jpg"
        ]
    },
    "nanoleaf-shapes": {
        image_url: "https://m.media-amazon.com/images/I/71qXlKZvbML._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71qXlKZvbML._AC_SL1500_.jpg"
        ]
    },
    "govee-glide-wall": {
        image_url: "https://m.media-amazon.com/images/I/71z7r0GxSqL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71z7r0GxSqL._AC_SL1500_.jpg"
        ]
    },
    "govee-tv-backlight-3": {
        image_url: "https://m.media-amazon.com/images/I/71UaNw-FPML._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71UaNw-FPML._AC_SL1500_.jpg"
        ]
    },
    "philips-hue-play": {
        image_url: "https://m.media-amazon.com/images/I/61PYCZ5kOBL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61PYCZ5kOBL._AC_SL1500_.jpg"
        ]
    },
    "corsair-icue-lt100": {
        image_url: "https://m.media-amazon.com/images/I/71VHXe1qYnL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71VHXe1qYnL._AC_SL1500_.jpg"
        ]
    },

    // === CAPTURE CARDS & CONTROLLERS ===
    "blackmagic-atem-mini-pro": {
        image_url: "https://m.media-amazon.com/images/I/71C+jxAGSQL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71C+jxAGSQL._AC_SL1500_.jpg"
        ]
    },
    "avermedia-lgp2-plus": {
        image_url: "https://m.media-amazon.com/images/I/61zDQl4rn7L._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61zDQl4rn7L._AC_SL1500_.jpg"
        ]
    },
    "loupedeck-live": {
        image_url: "https://m.media-amazon.com/images/I/71vJoXvbH1L._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71vJoXvbH1L._AC_SL1500_.jpg"
        ]
    },
    "roland-v02hd-mk2": {
        image_url: "https://m.media-amazon.com/images/I/71aMV-SjgOL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71aMV-SjgOL._AC_SL1500_.jpg"
        ]
    },

    // === AUDIO INTERFACES ===
    "focusrite-scarlett-2i2-4th-gen": {
        image_url: "https://m.media-amazon.com/images/I/71LurgpyPnL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71LurgpyPnL._AC_SL1500_.jpg"
        ]
    },
    "ssl-2-plus": {
        image_url: "https://m.media-amazon.com/images/I/71lL2O1t5eL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71lL2O1t5eL._AC_SL1500_.jpg"
        ]
    },
    "steinberg-ur22c": {
        image_url: "https://m.media-amazon.com/images/I/71wpO6hLCZL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71wpO6hLCZL._AC_SL1500_.jpg"
        ]
    },
    "presonus-studio-24c": {
        image_url: "https://m.media-amazon.com/images/I/71BNPY0OZGL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71BNPY0OZGL._AC_SL1500_.jpg"
        ]
    },

    // === SPEAKERS & MONITORS ===
    "jbl-305p-mkii": {
        image_url: "https://m.media-amazon.com/images/I/71cN2TmE+8L._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71cN2TmE+8L._AC_SL1500_.jpg"
        ]
    },
    "krk-rokit-rp5-g4": {
        image_url: "https://m.media-amazon.com/images/I/81yEptFr5dL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/81yEptFr5dL._AC_SL1500_.jpg"
        ]
    },
    "mackie-cr3-x": {
        image_url: "https://m.media-amazon.com/images/I/71sgjONiVpL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71sgjONiVpL._AC_SL1500_.jpg"
        ]
    },

    // === HEADPHONES ===
    "sennheiser-hd-280-pro-new": {
        image_url: "https://m.media-amazon.com/images/I/71S8piuRwWL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71S8piuRwWL._AC_SL1500_.jpg"
        ]
    },

    // === MISC ACCESSORIES ===
    "rode-psa1-plus": {
        image_url: "https://m.media-amazon.com/images/I/61GXKpIWBaL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61GXKpIWBaL._AC_SL1500_.jpg"
        ]
    },
    "neewer-green-screen-mountable": {
        image_url: "https://m.media-amazon.com/images/I/71Px7J6mX1L._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71Px7J6mX1L._AC_SL1500_.jpg"
        ]
    },
    "parrot-teleprompter-2": {
        image_url: "https://m.media-amazon.com/images/I/71lQk3FWNOL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/71lQk3FWNOL._AC_SL1500_.jpg"
        ]
    },
    "alex-tech-sleeve": {
        image_url: "https://m.media-amazon.com/images/I/81qKz0Q3cCL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/81qKz0Q3cCL._AC_SL1500_.jpg"
        ]
    },
    "d-line-cable-box": {
        image_url: "https://m.media-amazon.com/images/I/61LLnlzpReL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61LLnlzpReL._AC_SL1500_.jpg"
        ]
    },
    "sommer-cable-galileo-238": {
        image_url: "https://m.media-amazon.com/images/I/61ZxjPx0OoL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61ZxjPx0OoL._AC_SL1500_.jpg"
        ]
    },
    "vovox-link-protect-s350-xlr": {
        image_url: "https://m.media-amazon.com/images/I/61R7mVk3r0L._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61R7mVk3r0L._AC_SL1500_.jpg"
        ]
    }
};

async function updateImages() {
    console.log('\n🔄 Applying curated Amazon images...\n');

    let updated = 0;
    let failed = 0;

    for (const [slug, data] of Object.entries(CURATED_IMAGES)) {
        process.stdout.write(`📷 ${slug}...`);

        const { data: result, error } = await supabase
            .from('products')
            .update({
                image_url: data.image_url,
                gallery_images: data.gallery_images
            })
            .eq('slug', slug)
            .select('id');

        if (error) {
            console.log(` ❌ ${error.message}`);
            failed++;
        } else if (!result || result.length === 0) {
            console.log(` ⚠️ Not found`);
            failed++;
        } else {
            console.log(` ✅`);
            updated++;
        }
    }

    console.log(`\n${'='.repeat(40)}`);
    console.log(`✅ Updated: ${updated}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`${'='.repeat(40)}`);
}

updateImages();
