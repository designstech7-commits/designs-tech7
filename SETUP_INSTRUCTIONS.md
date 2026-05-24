# Designs.Tech7 - Setup Instructions / செட்அப் வழிமுறைகள்

## Problem-க்கு காரணம்:
1. `.env.local` file இல்லை
2. Supabase credentials குடுக்கல

## Fix செய்வது எப்படி:

### Step 1: Supabase Account Setup
1. https://supabase.com போங்க
2. Sign up / Login pannunga
3. "New Project" button click pannunga
4. Project name, database password குடுங்க
5. Project create aagum வரை wait pannunga (2-3 minutes)

### Step 2: Get Your Credentials
1. Supabase dashboard-ல உங்க project-ஐ திறங்க
2. Left sidebar-ல "Settings" → "API" click pannunga
3. அங்க இந்த values கிடைக்கும்:
   - **Project URL** - இது `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key - இது `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key - இது `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Update .env.local File
1. உங்க project folder-ல `.env.local` file-ஐ open pannunga
2. கீழே உள்ள values-ஐ replace pannunga:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.yyyyyyyyyyyyyyy
```

⚠️ **IMPORTANT**: Real values-ஐ மட்டும் use pannunga, placeholders-ஐ இல்ல!

### Step 4: Setup Database Schema
1. Supabase dashboard-ல "SQL Editor" click pannunga
2. `supabase/schema.sql` file-இல் உள்ள SQL code-ஐ copy pannunga
3. SQL Editor-ல paste பண்ணி "Run" click pannunga

### Step 5: Run the Application
```bash
# Stop any running servers first (Ctrl+C)

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

### Step 6: Open Browser
Open: http://localhost:3000

---

## Common Errors / சாதாரண பிழைகள்:

### Error: "Invalid supabaseUrl"
**Fix**: `.env.local` file-ல correct Supabase URL add pannunga

### Error: "Cannot find module server.js"
**Fix**: `package.json`-ல `"dev": "next dev"` இருக்குன்னு check pannunga

### Error: "Module not found"
**Fix**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use
**Fix**:
```bash
# Windows:
netstat -ano | findstr :3000
taskkill /PID <process_id> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill
```

---

## Files Created / உருவாக்கப்பட்ட கோப்புகள்:
- `.env.local` - Environment variables file
- `SETUP_INSTRUCTIONS.md` - இந்த file

## Next Steps:
1. Supabase account create pannunga
2. Project credentials எடுங்க
3. `.env.local` update pannunga
4. `npm install` run pannunga
5. `npm run dev` run pannunga

---

## Support:
If you face any issues, share:
- Error message screenshot
- `.env.local` file (without actual keys!)
- Terminal output

Happy coding! 🚀
