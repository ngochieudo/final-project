'use client'
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, FormGroup, IconButton, OutlinedInput, InputAdornment, Modal, InputLabel, FormControl, Button } from "@mui/material"
import { useState } from "react";
type IProps = {
    showModalSignIn: boolean;
    setShowModalSignIn: (v: boolean) => void;
}

const SignInModal = (props: IProps) => {
    const { showModalSignIn, setShowModalSignIn } = props
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const handleClickShowPassword = () => {
        setShowPassword((show) => !show);
    };

    const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    };
    const handleSubmit = () => {
        console.log(email, password)
    }
    return (
        <>
            <Modal
                open={showModalSignIn}
                onClose={() => setShowModalSignIn(false)}
                keepMounted
            >
                <Box sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    bgcolor: 'background.paper',
                    boxShadow: 2,
                    borderRadius: '1.25rem',
                    p: 4,
                }}>
                    <FormGroup sx={{ border: 'none' }}>
                        <span className="font-bold text-2xl">Sign in to your account</span>
                        <FormControl sx={{ marginTop: 4, width: '100%' }} >
                            <InputLabel>Email</InputLabel>
                            <OutlinedInput 
                            label="Email" 
                            type="email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)}
                            className="rounded-[10px]" 
                            required 
                            />
                        </FormControl>

                        <FormControl sx={{ marginTop: 4, width: '100%' }}>
                            <InputLabel>Password</InputLabel>
                            <OutlinedInput
                                type={showPassword ? 'text' : 'password'}
                                className="rounded-[10px]"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff className="text-[16px]" /> : <Visibility className="text-[16px] text-primary" />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>
                        <Button
                            variant="contained"
                            className="w-full bg-primary text-white font-bold normal-case mt-8 rounded-[30px] py-3"
                            onClick={handleSubmit}
                        >
                            Log in
                        </Button>
                    </FormGroup>
                </Box>
            </Modal>
        </>
    )
}
export default SignInModal