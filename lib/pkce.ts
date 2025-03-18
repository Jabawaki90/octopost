import pkceChallenge from 'pkce-challenge';

// Define an interface for PKCE codes
export interface PkceCodes {
  code_verifier: string;
  code_challenge: string;
}

// Function to generate PKCE codes
export async function generatePkceCodes(): Promise<PkceCodes> {
  const pkce = await pkceChallenge();
  return {
    code_verifier: pkce.code_verifier,
    code_challenge: pkce.code_challenge,
  };
}