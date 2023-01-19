
// Define if the environment is development
const devEnv = false;

// Set all the static variables in the project
const vars = {
  baseUrl: devEnv ? 'http://localhost:8000' : 'https://35.225.123.125',
  stripeUrl: devEnv ? 'pk_test_k2rd0kRfCXUc2I62qwxzuH5A00mUkCi9Hv' : 'pk_live_9mCCKga6w9sl8XyZFOEKkaXZ00T0bptR46',
}

export default vars;