import fs from 'fs/promises';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Using MyMemory Translation API (Free - 10,000 words/day, no API key required)
// Supports all major languages including all Indian languages

// Language codes for translation (MyMemory uses ISO 639-1 codes)
const LANGUAGES = {
    hi: 'Hindi',
    kn: 'Kannada',
    ta: 'Tamil',
    te: 'Telugu',
    ml: 'Malayalam',
    mr: 'Marathi',
    bn: 'Bengali',
    gu: 'Gujarati'
};

// Add delay to respect rate limits
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to make HTTPS request
function httpsGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// Function to translate text using MyMemory API
async function translateText(text, targetLang) {
    try {
        // MyMemory API endpoint
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;

        const data = await httpsGet(url);

        if (data.responseStatus === 200 && data.responseData) {
            return data.responseData.translatedText;
        } else {
            throw new Error(`Translation failed: ${data.responseDetails || 'Unknown error'}`);
        }
    } catch (error) {
        console.error(`  ✗ Error translating "${text}":`, error.message);
        return text; // Return original text if translation fails
    }
}

// Function to translate a nested object
async function translateObject(obj, targetLang) {
    const result = {};

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
            // Recursively translate nested objects
            result[key] = await translateObject(value, targetLang);
        } else if (typeof value === 'string') {
            // Translate the string with delay to respect rate limits
            await delay(200); // 200ms delay between requests
            const translation = await translateText(value, targetLang);
            result[key] = translation;
            console.log(`  ✓ Translated: "${value}" → "${translation}"`);
        } else {
            result[key] = value;
        }
    }

    return result;
}

async function generateTranslations() {
    try {
        console.log('🌍 Starting translation process using MyMemory API (Free)...\n');
        console.log('ℹ️  Using free MyMemory API - No API key required!');
        console.log('ℹ️  Rate limit: 10,000 words/day\n');

        // Read the English source file
        const enPath = path.join(__dirname, 'src', 'i18n', 'locales', 'en.json');
        const enContent = await fs.readFile(enPath, 'utf8');
        const enData = JSON.parse(enContent);

        console.log(`📖 Loaded English translations from: ${enPath}\n`);

        // Translate for each language
        for (const [langCode, langName] of Object.entries(LANGUAGES)) {
            console.log(`\n🔄 Translating to ${langName} (${langCode})...`);
            console.log('⏳ This may take a few minutes due to rate limiting...\n');

            const translated = await translateObject(enData, langCode);

            // Save the translated file
            const outputPath = path.join(__dirname, 'src', 'i18n', 'locales', `${langCode}.json`);
            await fs.writeFile(outputPath, JSON.stringify(translated, null, 2), 'utf8');

            console.log(`\n✅ Saved ${langName} translations to: ${outputPath}`);

            // Wait a bit between languages to avoid rate limiting
            const langKeys = Object.keys(LANGUAGES);
            if (langKeys.indexOf(langCode) < langKeys.length - 1) {
                console.log('⏳ Waiting 2 seconds before next language...');
                await delay(2000);
            }
        }

        console.log('\n\n🎉 Translation complete! All files have been generated.');
        console.log('\n📝 Next steps:');
        console.log('1. Review the generated translation files');
        console.log('2. Have native speakers verify accuracy');
        console.log('3. Make any necessary corrections directly in the JSON files');
        console.log('\n💡 Tip: MyMemory API is free but has a daily limit of 10,000 words.');
        console.log('   If you hit the limit, just wait 24 hours and run again.');

    } catch (error) {
        console.error('\n❌ Error during translation:', error);
        console.log('\n⚠️  Possible issues:');
        console.log('1. Check your internet connection');
        console.log('2. You may have hit the daily rate limit (10,000 words/day)');
        console.log('3. The MyMemory API service might be temporarily down');
        console.log('\n💡 Solution: Wait a few hours and try again, or translate in batches.');
    }
}

// Run the translation
generateTranslations();
