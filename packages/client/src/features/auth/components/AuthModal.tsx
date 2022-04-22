import { Button, Input, Loading, Modal, Text } from '@nextui-org/react';
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { FunctionComponent, useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from 'reactfire';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export const AuthModal: FunctionComponent<AuthModalProps> = ({ open, onClose }) => {
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState<[string, string, string, string, string, string]>([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  const generateRecaptcha = useCallback(() => {
    return new RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisibile',
        callback: () => {},
      },
      auth
    );
  }, [auth]);

  const requestOTP = useCallback(() => {
    setLoading(true);

    const pn = `+60${phoneNumber}`;

    // validate phone number
    if (!pn.match(/^(\+?6?01)[02-46-9]-*[0-9]{7}$|^(\+?6?01)[1]-*[0-9]{8}$/)) {
      setLoading(false);
      toast('phone number invalid', { type: 'error' });
      return;
    }

    // generate recaptcha
    const recaptchaVerifier = generateRecaptcha();

    // send otp
    signInWithPhoneNumber(auth, pn, recaptchaVerifier)
      .then((confirmationResult) => {
        setOtpSent(true);
        toast(`OTP had been sent to ${pn}`, { type: 'success' });
        setConfirmationResult(confirmationResult);
      })
      .catch((err) => {
        console.error(err);
        toast('error logging in with phone number', { type: 'error' });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [auth, generateRecaptcha, phoneNumber]);

  const verifyOTP = () => {
    setLoading(true);
    if (!confirmationResult) {
      setLoading(false);
      toast('OTP had not been sent yet', { type: 'error' });
      return;
    }
    for (const c of otp) {
      if (c === '') {
        setLoading(false);
        toast('OTP is incomplete', { type: 'error' });
        return;
      }
    }

    confirmationResult
      .confirm(otp.join(''))
      .then((result) => {
        toast('successfully logged in', { type: 'success' });
        const user = result.user;
        console.log(user);
      })
      .catch((err) => {
        toast('OTP is incorrect', { type: 'error' });
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Modal closeButton aria-labelledby="auth-modal-title" open={open} onClose={onClose}>
        <Modal.Header id="auth-modal-title">
          <img
            className="h-10 object-scale-down w-full"
            src="/images/LightChaser_Logo.png"
            alt="title"
          />
        </Modal.Header>
        <Modal.Body css={{ paddingBottom: '$12' }}>
          <Input
            bordered
            fullWidth
            color="primary"
            size="lg"
            maxLength={10}
            placeholder="Phone Number..."
            contentLeftStyling={false}
            contentLeft={
              <p className="pl-4 -mr-2 text-lg font-bold whitespace-nowrap text-clip text-console">
                {'> +60'}
              </p>
            }
            css={{ fontWeight: 'bold' }}
            inputMode="tel"
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {otpSent && (
            <div className="w-full flex justify-between">
              <Input
                bordered
                width="50px"
                color="primary"
                size="md"
                maxLength={1}
                onChange={(e) => setOtp([e.target.value, otp[1], otp[2], otp[3], otp[4], otp[5]])}
              />
              <Input
                bordered
                width="50px"
                color="primary"
                size="md"
                maxLength={1}
                onChange={(e) => setOtp([otp[0], e.target.value, otp[2], otp[3], otp[4], otp[5]])}
              />
              <Input
                bordered
                width="50px"
                color="primary"
                size="md"
                maxLength={1}
                onChange={(e) => setOtp([otp[0], otp[1], e.target.value, otp[3], otp[4], otp[5]])}
              />
              <Input
                bordered
                width="50px"
                color="primary"
                size="md"
                maxLength={1}
                onChange={(e) => setOtp([otp[0], otp[1], otp[2], e.target.value, otp[4], otp[5]])}
              />
              <Input
                bordered
                width="50px"
                color="primary"
                size="md"
                maxLength={1}
                onChange={(e) => setOtp([otp[0], otp[1], otp[2], otp[3], e.target.value, otp[5]])}
              />
              <Input
                bordered
                width="50px"
                color="primary"
                size="md"
                maxLength={1}
                onChange={(e) => setOtp([otp[0], otp[1], otp[2], otp[3], otp[4], e.target.value])}
              />
            </div>
          )}
          <div id="recaptcha-container" className="flex justify-center items-center z-10" />
          {!otpSent ? (
            <Button auto onClick={requestOTP} disabled={loading}>
              {loading ? <Loading /> : <Text weight="bold">Send Code</Text>}
            </Button>
          ) : (
            <Button auto onClick={verifyOTP} disabled={loading}>
              {loading ? <Loading /> : <Text weight="bold">Verify OTP</Text>}
            </Button>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
