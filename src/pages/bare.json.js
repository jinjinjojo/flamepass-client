export async function get({ params, request }) {
  return {
    body: JSON.stringify(['$HOST/test']),
  };
}
