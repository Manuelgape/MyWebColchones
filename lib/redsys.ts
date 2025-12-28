/**
 * Submit a form to Redsys payment gateway
 */
export function submitRedsysPayment(paymentForm: {
  Ds_SignatureVersion: string;
  Ds_MerchantParameters: string;
  Ds_Signature: string;
  action_url: string;
}): void {
  // Create a hidden form
  const form = document.createElement("form");
  form.method = "POST";
  form.action = paymentForm.action_url;

  // Add form fields
  const fields = {
    Ds_SignatureVersion: paymentForm.Ds_SignatureVersion,
    Ds_MerchantParameters: paymentForm.Ds_MerchantParameters,
    Ds_Signature: paymentForm.Ds_Signature,
  };

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  // Add form to page and submit
  document.body.appendChild(form);
  form.submit();
}
