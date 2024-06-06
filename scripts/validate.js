let loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let username = document.getElementById("username").value;
  let validUsernamePattern = /^[a-zA-Z0-9 !@#$^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
  
  if (email == "" || password == "" || username == "") {
    alert("Ensure you input a value in all fields!");
  } else {
    if (!validUsernamePattern.test(username)) {
        alert("Username cannot contains special characters.");
    } else if (username.length > 20) {
        alert("Username cannot longer than 20 characters.");
    } else {
        validate()
    }
  }
});

async function validate() {
  let obj;
  const res = await fetch(
    "https://dev-nakama.winterpixel.io/v2/account/authenticate/email?create=false",
    {
      method: "POST",
      headers: {
        authorization: "Basic OTAyaXViZGFmOWgyZTlocXBldzBmYjlhZWIzOTo=",
      },
      body: JSON.stringify({
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        vars: { client_version: "99999" },
      }),
    }
  );
  obj = await res.json();
  status_code = res.status;
  console.log(obj);
  token = obj["token"];
  console.log(token);


  if (status_code == 200) {
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
    username = document.getElementById("username").value;

    console.log(token)
    console.log(username)
    const res2 = await fetch(
      "https://dev-nakama.winterpixel.io/v2/account",
      {
        method: "PUT",
        headers: {
          authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          display_name: username,
        }),
      }
    );

    if (document.getElementById('remember').checked) {
      setCookie("email", email, 9999)
      setCookie("password", password, 9999)
    }

    alert("Success!");
  } else if (status_code == 401) {
    alert("Invalid credentials.");
  } else if (status_code == 404) {
    alert("User account not found.");
  }
}