import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ColorModeSelect from './ColorModeSelect';
import { useRouter } from 'next/navigation';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: { width: '450px' },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: '100%',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(4) },
}));

export default function RegisterForm() {
  const router = useRouter();
  const [globalError, setGlobalError] = React.useState('');
  const [role, setRole] = React.useState('client');

  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const name = document.getElementById('name');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    const data = new FormData(event.currentTarget);
    const jsonData = Object.fromEntries(data.entries());

    try {
      const authResponse = await fetch(`${process.env.NEXT_APP_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: jsonData.email,
          password: jsonData.password,
          name: jsonData.name,
          role: role,
        }),
      });

      const authResult = await authResponse.json();

      if (!authResponse.ok) {
        setGlobalError(authResult.msg || "Registration failed");
        return;
      }

      if (authResult.token) {
        window.localStorage.setItem("token", authResult.token);
      }

      if (role === "investor") {
        const investorData = {
          id: jsonData.id,
          name: jsonData.name,
          legal_status: jsonData.legal_status,
          address: jsonData.address,
          email: jsonData.email,
          phone: jsonData.phone,
          created_at: jsonData.created_at,
          description: jsonData.description,
          investor_type: jsonData.investor_type,
          investment_focus: jsonData.investment_focus,
        };

        await fetch(`${process.env.NEXT_APP_API_URL}/investors`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authResult.token}`,
          },
          body: JSON.stringify(investorData),
        });
      }

      if (role === "founder") {
        const startupData = {
          name: jsonData.name,
          legal_status: jsonData.legal_status,
          address: jsonData.address,
          email: jsonData.email,
          phone: jsonData.phone,
          description: jsonData.description,
          website_url: jsonData.website_url,
          social_media_url: jsonData.social_media_url,
          project_status: jsonData.project_status,
          needs: jsonData.needs,
          sector: jsonData.sector,
          maturity: jsonData.maturity,
          founders: jsonData.founders,
          image: jsonData.image,
          founder_id: jsonData.founder_id,
        };

        await fetch(`${process.env.NEXT_APP_API_URL}/startups`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authResult.token}`,
          },
          body: JSON.stringify(startupData),
        });
      }

      router.push("/Login");
    } catch (error) {
      console.error("Error:", error);
      setGlobalError("An error occurred. Please try again later.");
    }
  };

  return (
    <main>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <SignUpContainer direction="column" justifyContent="center">
        <Card variant="outlined">
          <Typography component="h1" variant="h4" sx={{ width: '100%', textAlign: 'center', mb: 2 }}>
            Sign up
          </Typography>
          {globalError && (
            <Typography color="error" sx={{ textAlign: 'center', mb: 2 }}>
              {globalError}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="name">Name</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Marvin"
                error={nameError}
                helperText={nameErrorMessage}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
              />
            </FormControl>

            <FormControl>
              <FormLabel id="role-label">Account Type</FormLabel>
              <RadioGroup
                row
                aria-labelledby="role-label"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <FormControlLabel value="founder" control={<Radio />} label="Founder" />
                <FormControlLabel value="investor" control={<Radio />} label="Investor" />
                <FormControlLabel value="client" control={<Radio />} label="Client" />
              </RadioGroup>
            </FormControl>

            {/* --- Si Founder --- */}
            {role === "founder" && (
              <>
                <FormControl>
                  <FormLabel htmlFor="name">Startup Name</FormLabel>
                  <TextField name="name" fullWidth placeholder="EcoLoop" />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="legal_status">Legal Status</FormLabel>
                  <TextField name="legal_status" fullWidth placeholder="SAS, SARL..." />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="address">Address</FormLabel>
                  <TextField name="address" fullWidth placeholder="77 Main Road, Dublin" />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="email">Startup Email</FormLabel>
                  <TextField name="email" fullWidth placeholder="contact@startup.com" />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="phone">Phone</FormLabel>
                  <TextField name="phone" fullWidth placeholder="+33 6 12 34 56 78" />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <TextField
                    name="description"
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Brief description of the project"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="website_url">Website</FormLabel>
                  <TextField name="website_url" fullWidth placeholder="https://startup.com" />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="social_media_url">Social Media</FormLabel>
                  <TextField name="social_media_url" fullWidth placeholder="https://linkedin.com/startup" />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="project_status">Project Status</FormLabel>
                  <TextField name="project_status" fullWidth placeholder="MVP, Prototype, etc." />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="needs">Needs</FormLabel>
                  <TextField
                    name="needs"
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Funding, Partners, Advisors..."
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="sector">Sector</FormLabel>
                  <TextField name="sector" fullWidth placeholder="DeepTech, AI, etc." />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="maturity">Maturity</FormLabel>
                  <TextField name="maturity" fullWidth placeholder="Idea, Seed, Series A..." />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="founders">Founders</FormLabel>
                  <TextField
                    name="founders"
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="List of founders"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="image">Logo / Image URL</FormLabel>
                  <TextField name="image" fullWidth placeholder="https://startup.com/logo.png" />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="founder_id">Founder ID</FormLabel>
                  <TextField name="founder_id" fullWidth placeholder="1" type="number" />
                </FormControl>
              </>
            )}

            {/* --- Si Investor --- */}
            {role === "investor" && (
              <>
                <FormControl>
                  <FormLabel htmlFor="id">Investor ID</FormLabel>
                  <TextField name="id" fullWidth placeholder="1" type="number" />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="name">Investor Name</FormLabel>
                  <TextField name="name" fullWidth placeholder="BrightCapital" />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="legal_status">Legal Status</FormLabel>
                  <TextField name="legal_status" fullWidth placeholder="GmbH, SARL..." />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="address">Address</FormLabel>
                  <TextField name="address" fullWidth placeholder="79 Venture Way, Lisbon" />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="email">Investor Email</FormLabel>
                  <TextField name="email" fullWidth placeholder="contact@brightcapital.com" />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="phone">Phone</FormLabel>
                  <TextField name="phone" fullWidth placeholder="+32 473 587 334" />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="created_at">Created At</FormLabel>
                  <TextField name="created_at" fullWidth type="date" />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <TextField
                    name="description"
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="We invest in sustainable urban development..."
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="investor_type">Investor Type</FormLabel>
                  <TextField name="investor_type" fullWidth placeholder="Family Office, VC, Angel..." />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="investment_focus">Investment Focus</FormLabel>
                  <TextField name="investment_focus" fullWidth placeholder="B2B, SaaS, FinTech..." />
                </FormControl>
              </>
            )}

            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
              />
            </FormControl>

            <Button type="submit" fullWidth variant="contained">
              Sign up
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Link href="/Login" variant="body2" sx={{ alignSelf: 'center' }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </main>
  );
}
