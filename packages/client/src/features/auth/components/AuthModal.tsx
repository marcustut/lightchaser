import { Button, Card, Col, Input, Loading, Modal, Row, Spacer, Text } from '@nextui-org/react';
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { FunctionComponent, useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from 'reactfire';

import { useDebounce } from '@/hooks';
import { trpc } from '@/lib/trpc';
import { useUser } from '@/store/useUser';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export const AuthModal: FunctionComponent<AuthModalProps> = ({ open, onClose }) => {
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
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
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText);
  const auth = useAuth();
  const { setUser } = useUser();
  const users = trpc.useQuery(['user.all']);

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

  const requestOTP = useCallback(async () => {
    if (!users.data) return;
    setLoading(true);

    const pn = `+60${phoneNumber}`;

    // validate phone number
    if (!pn.match(/^(\+?6?01)[02-46-9]-*[0-9]{7}$|^(\+?6?01)[1]-*[0-9]{8}$/)) {
      setLoading(false);
      toast('phone number invalid', { type: 'error' });
      return;
    }

    if (!users.data.find((u) => u.contactNumber.includes(phoneNumber))) {
      setLoading(false);
      setError('Unable to find this phone number');
      toast('phone number is not registered', { type: 'error' });
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
  }, [auth, generateRecaptcha, phoneNumber, users]);

  const verifyOTP = () => {
    if (!users.data) return;

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
      .then(() => {
        const user = users.data.find((u) => u.contactNumber.includes(phoneNumber));
        if (!user) {
          auth.signOut();
          toast('an error occured', { type: 'error' });
          return;
        }
        setUser(user);
        toast('successfully logged in', { type: 'success' });
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
          {error && users.data && (
            <>
              <Col>
                <Row css={{ display: 'flex', flexDirection: 'column' }}>
                  <Text color="error">{error}</Text>
                  <Text color="error">Click your name from the list</Text>
                </Row>
                <Spacer y={1} />
                <Row>
                  <Input
                    inputMode="search"
                    bordered
                    fullWidth
                    placeholder="Try searching yourself (eg. name / IC number)"
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </Row>
                {debouncedSearchText.length > 3 &&
                  users.data
                    .filter((user) =>
                      `${user.name.toLowerCase()},${user.identityCardNumber},${
                        user.contactNumber
                      }`.includes(debouncedSearchText.toLowerCase())
                    )
                    .map((user, idx) => (
                      <Card
                        key={user.identityCardNumber}
                        clickable
                        css={{ borderWidth: '0', marginTop: idx === 0 ? '$8' : '$4' }}
                        color="primary"
                        onClick={() =>
                          window.open(
                            `https://wa.me/+60163066883?text=${encodeURI(
                              `Hi, *${user.name}* here\nI was not able to login and my IC Number is *_${user.identityCardNumber}_* and the registered phone number is *_${user.contactNumber}_*`
                            )}`
                          )
                        }
                      >
                        <Text weight="bold">{user.name}</Text>
                      </Card>
                    ))}
              </Col>
            </>
          )}
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
              {loading ? <Loading size="xs" /> : <Text weight="bold">Send Code</Text>}
            </Button>
          ) : (
            <Button auto onClick={verifyOTP} disabled={loading}>
              {loading ? <Loading size="xs" /> : <Text weight="bold">Verify OTP</Text>}
            </Button>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
