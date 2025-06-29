export const useAuth = () => {
  const client = useSupabaseClient();

  const signUp = async (email: string, password: string) => {
    const { data, error } = await client.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
    return data;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
    return data;
  };

  const signOut = async () => {
    await client.auth.signOut();
  };

  const user = useSupabaseUser();

  return { signUp, signIn, signOut, user };
};
