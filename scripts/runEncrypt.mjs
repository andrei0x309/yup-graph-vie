import dotenv from 'dotenv';
import { encrypt } from 'pagecrypt'
import fs from 'fs'
 
dotenv.config();

const ENCRYPT_PASS = process.env['ENCRYPT_PASS'] ?? '';

if(!ENCRYPT_PASS) throw new Error('ENCRYPT_PASS is not set');

console.log("Starting post build encryption of SPA");

await encrypt('dist/index.html', 'dist/encrypted.html', ENCRYPT_PASS)
fs.unlinkSync('dist/index.html')
fs.renameSync('dist/encrypted.html', 'dist/index.html' )
let data = fs.readFileSync('dist/index.html', 'utf8')
data = data.replace(/<a.*?\/a>/, '').replace('<main class', '<main style="background: linear-gradient(to right, #0f0c29, #302b63, #24243e);" class=')
fs.writeFileSync('dist/index.html', data, {
    encoding: 'utf8',
    flag: 'w'
})