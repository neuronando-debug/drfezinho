# Security Guidelines for FinanceApp

## Environment Variables

### Public Variables (Frontend Safe)
These variables are prefixed with `NEXT_PUBLIC_` and are safe to expose to the browser:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL (non-sensitive)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase public anonymous key

**Why these are safe:**
- The anonymous key is designed for client-side use
- It only has access to data authorized by Row Level Security (RLS) policies
- It cannot perform administrative operations

### Private Variables (Server-Side Only)
⚠️ **NEVER expose these to the frontend:**

- `SUPABASE_SERVICE_ROLE_KEY`: Server-side only key with full database access
- Database passwords
- Private API keys
- JWT secrets

## Security Architecture

### Supabase Authentication Flow
1. User authenticates via Supabase Auth
2. Frontend uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` for API calls
3. Supabase RLS policies enforce data access control
4. Server-side operations use `SUPABASE_SERVICE_ROLE_KEY` if needed

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own transactions
- Admin operations are protected by RLS policies

## Vercel Deployment

### Setting Environment Variables
1. Go to Vercel Project Settings
2. Navigate to Environment Variables
3. Add the following:
   - `NEXT_PUBLIC_SUPABASE_URL` (Public)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Public)
4. **DO NOT** add any private keys to Vercel environment variables unless needed for server-side operations

### Verification
- Check `.env.local` and `.env.example` in git
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is **NOT** in version control
- Verify no secrets appear in build logs

## Best Practices

✅ **Do:**
- Use `NEXT_PUBLIC_` prefix only for truly public data
- Implement RLS policies in Supabase
- Keep `.env.local` in `.gitignore`
- Use `.env.example` to document required variables
- Rotate API keys regularly

❌ **Don't:**
- Commit `.env.local` to version control
- Expose private keys in code
- Trust client-side validation for security
- Store sensitive data in browser storage (use secure cookies)
- Skip RLS configuration

## Incident Response

If a key is accidentally committed:
1. Revoke the key immediately in Supabase dashboard
2. Use `git filter-branch` or BFG to remove from history
3. Force push only if no one has pulled the compromised commit
4. Generate new keys

---
For more information, see:
- [Supabase Security Guide](https://supabase.com/docs/guides/platform/security)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
