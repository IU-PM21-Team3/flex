import flexFirebase from "../firebase/clientApp";
import { GoogleLoginButton, MicrosoftLoginButton } from 'react-social-login-buttons';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState
} from "react";
import { CircularProgress, TextField, Button } from "@material-ui/core";

//ref : https://qiita.com/harker/items/a3f4e2b2663664a206e1

export type SignInUpTextValues = "登録" | "ログイン";
export const SignInText: SignInUpTextValues = "ログイン";
export const SignUpText: SignInUpTextValues = "登録";


const SignInUp = ({ signInUpText }: { signInUpText: SignInUpTextValues }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [_signInUpText, setSignInUpText] = useState<SignInUpTextValues>(signInUpText);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function setState(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, setAction: Dispatch<SetStateAction<string>>) {
    setAction(e.currentTarget.value);
  }

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    // ページ更新を抑止
    e.preventDefault();
    try {
      createUserWithEmailAndPassword(flexFirebase.auth, email, password);
    } catch (e) {
      window.alert(e);
    }
  };

  const GoogleButtonPushed = () => {
    setIsLoading(true);
    signInWithPopup(flexFirebase.auth, new GoogleAuthProvider()).finally(() => setIsLoading(false));
  };
  const MicrosoftButtonPushed = () => {
    setIsLoading(true);
    signInWithPopup(flexFirebase.auth, new OAuthProvider('microsoft.com')).finally(() => setIsLoading(false));
  };

  const onFormSubmitted = () => {
    setIsLoading(true);
    if (_signInUpText == SignUpText) {
      createUserWithEmailAndPassword(flexFirebase.auth, email, password)
        .then(user => {
          // ユーザ登録成功時の処理 (DBにユーザ登録)
        })
        .catch(e => {
          console.error(e);
          setErrorMessage("ユーザ登録に失敗しました.  " + e.toString());
        })
        .finally(() => setIsLoading(false));
    } else {
      signInWithEmailAndPassword(flexFirebase.auth, email, password)
        .catch(e => {
          console.error(e);
          setErrorMessage("ログインに失敗しました.  " + e.toString());
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div>
      <GoogleLoginButton onClick={GoogleButtonPushed} align="center" iconSize={'20'}>
        <span style={{ fontSize: 16 }}>Googleで{_signInUpText}</span>
      </GoogleLoginButton>
      <MicrosoftLoginButton onClick={MicrosoftButtonPushed} align="center" iconSize={'20'}>
        <span style={{ fontSize: 16 }}>Microsoftで{_signInUpText}</span>
      </MicrosoftLoginButton>

      <form onSubmit={submitHandler}>
        <div>
          <TextField
            fullWidth
            label="メールアドレス"
            type="email"
            value={email}
            onChange={e => setState(e, setEmail)}
            margin="normal"
          />
        </div>
        <div>
          <TextField
            fullWidth
            label="パスワード"
            type="password"
            value={password}
            onChange={e => setState(e, setPassword)}
            margin="normal"
          />
        </div>
        <div style={{ color: '#fa755a' }}>{errorMessage}</div>
        {
          isLoading
            ? (<CircularProgress style={{ marginTop: 5 }} />)
            : (
              <Button style={{ margin: 20 }} onClick={onFormSubmitted} variant="contained" color="primary">
                {_signInUpText}
              </Button>
            )
        }
      </form>
    </div>
  );
};

export default SignInUp;