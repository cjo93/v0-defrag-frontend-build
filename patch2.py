import re

with open('lib/me-status.ts', 'r') as f:
    content = f.read()

content = content.replace(
"""    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, subscription_status, email')
      .eq('user_id', userId)
      .single();

    // Fetch birthline
    const { data: birthline } = await supabase
      .from('birthlines')
      .select('id')
      .eq('user_id', userId)
      .single();""",
"""    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, subscription_status, email')
      .eq('user_id', userId)
      .maybeSingle();

    // Fetch birthline
    const { data: birthline } = await supabase
      .from('birthlines')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();""")

with open('lib/me-status.ts', 'w') as f:
    f.write(content)
