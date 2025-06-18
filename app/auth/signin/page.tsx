'use client';

import { signIn, getProviders } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [providers, setProviders] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    getProviders().then((prov: any) => setProviders(prov));
  }, []);

  if (!providers) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign in to AI Startup Ideas</h1>
        {Object.values(providers).map((provider: any) => (
          <div key={provider.name} className="mb-4">
            {provider.type === 'credentials' ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const email = (e.currentTarget as any).email.value;
                  await signIn(provider.id, { email, callbackUrl: '/' });
                  router.refresh();
                }}
                className="flex space-x-2"
              >
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  className="flex-1 border border-gray-300 p-2 rounded"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Continue
                </button>
              </form>
            ) : (
              <button
                onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded"
              >
                Sign in with {provider.name}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}