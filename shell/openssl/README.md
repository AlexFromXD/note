- generate private key

  ```sh
  $ openssl genrsa -out private.pem
  ```

- generate public key

  ```sh
  $ openssl rsa -in private.pem -outform pem -pubout -out public.pem
  ```

- encrypt & decrypt

  ```sh
  $ openssl rsautl -encrypt -pubin -inkey public.pem -in msg.txt -out msg.cipher

  $ openssl rsautl -decrypt -inkey private.pem -in msg.cipher
  ```

- signature

  ```sh
  $ openssl rsautl -sign -inkey private.pem -in msg.txt -out msg.sign

  $ openssl rsautl -inkey public.pem -pubin -in msg.sign
  ```
