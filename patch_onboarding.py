import re

with open('app/onboarding/page.tsx', 'r') as f:
    content = f.read()

replacement = """
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const session = await getSession();
      if (!session) throw new Error("Unauthorized");

      // Direct write to Supabase birthlines per instructions
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${session.access_token}`
            }
          }
        }
      );

      const finalTime = unknownTime ? "12:00:00" : (time.includes(':') && time.length === 5 ? time + ':00' : time);

      const payload = {
        user_id: session.user.id,
        dob,
        birth_time: unknownTime ? null : finalTime,
        birth_city: location
      };

      const { error } = await supabase.from('birthlines').insert(payload);

      if (error) {
        console.error('Insert error:', error);
        throw new Error("Failed to save birthline data.");
      }

      toast({
        title: "Profile created",
        description: "Your baseline has been saved successfully.",
      });

      router.push("/dashboard");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
"""

content = re.sub(
    r'  const handleSubmit = async \(e: React.FormEvent\) => \{.*?setLoading\(false\);\n    \}\n  \};\n',
    replacement,
    content,
    flags=re.DOTALL
)

with open('app/onboarding/page.tsx', 'w') as f:
    f.write(content)
