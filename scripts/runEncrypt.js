import dotenv from 'dotenv';
import { encrypt } from 'pagecrypt'
import fs from 'fs'
 
dotenv.config();

const ENCRYPT_PASS = process.env['DISCORD_TOKEN']


console.log("Starting post build encryption of SPA");

await encrypt('dist/index.html', 'dist/encrypted.html', ENCRYPT_PASS)
fs.unlinkSync('dist/index.html')
fs.renameSync('dist/encrypted.html', 'dist/index.html' )
