// pages/api/admin/get-users.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ users: data.users });
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error occurred' });
  }
}
