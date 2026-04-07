
async function debugProfile() {
    const { data: profile } = await window.supabase.from('profiles').select('*').limit(1).single();
    console.log('--- PROFILE SCHEMA DEBUG ---');
    console.log(Object.keys(profile));
    console.log(profile);
}
// Run this in the console of any page that has supabase-client.js
