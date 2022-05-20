# Implement data flow for three-way binding form.

Implement a simpler version of <a href="https://wise.com/" target="_blank">this currency conversion form</a>. We are only
interested in two input fields from it. Currencies are predefined, it will always be EUR to USD conversion. Formula
display is not needed as well as form submission button. 

When user changes the value in sent amount or received amount input app should post changed value to the server, wait
for it to generate a new rate quote and replace old values with new ones.

Currencies are predefined, it will always be EUR to USD conversion.

It is important for quote to be generated from source value that user is interested in - sent or received value,
since rate is calculated on the go and depends on the conversion side. That is why app should only post the value that
was changed by the user(sentAmount OR receivedAmount).

Quote can expire, in this case app should generate a new quote using the source amount with which expired quote was
generated.  
  
## Service interface
    POST http://localhost:5000/api/generate-rate-quote

    type GenerateRateQuoteApiBody =
      | { sentAmount: string; receivedAmount?: never }
      | { sentAmount?: never; receivedAmount: string };

    type GenerateRateQuoteApiPayload = {
      sentAmount: string;
      receivedAmount: string;
      rate: string;
      expiresAt: string;
    };


## Important points

<ol>
  <li>Final file and code structure will be an object of assessment.</li>

  <li>Use reactive forms library.</li>

  <li>Use OnPush change detection strategy.</li>

  <li>Prevent unnecessary form value updates(with same data).</li>

  <li>You should only send valid numbers(number and greater than zero) and otherwise display validation error.</li>

  <li>Values should be debounced for 500 ms before sending to service.</li>

  <li>While user awaits for new data we should display loader for him. This includes debounce time and api call 
  delay. For user, it should look like once he entered a valid number we started calculating data for him.</li>

  <li>When quote is expired user should see information about it.</li>

  <li>Rate field in the payload is for display purposes only, client should use values calculated on the server.</li>
</ol>

## Serve client

Use `start client` npm script and navigate to `http://localhost:4200/`

## Start server

Use `start server` npm script. Server listens on `http://localhost:5000/`
