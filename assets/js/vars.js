
// Define if the environment is development
const devEnv = false;

// Set all the static variables in the project

const vars = {
  baseUrl: devEnv ? 'http://127.0.0.1:8000' : 'https://api.123helpmestudy.com',
  stripeUrl: devEnv ? 'pk_test_k2rd0kRfCXUc2I62qwxzuH5A00mUkCi9Hv' : 'pk_live_9mCCKga6w9sl8XyZFOEKkaXZ00T0bptR46',
}

export default vars;