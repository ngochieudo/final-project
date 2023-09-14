import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { Button } from '@mui/material';

type SideNavProps = {
    pages: string[];
}
export default function SideNav(props: SideNavProps) {
    const { pages } = props
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

    return (
        <React.Fragment>
            <Button onClick={handleOpen} className='hidden max-md:block'>
                <MenuIcon fontSize='large' className='text-black' />
            </Button>
            <Drawer
                anchor={'left'}
                open={open}
                onClose={handleClose}
            >
                <Box
                    sx={{ width: 300 }}
                    role="presentation"
                >
                    <List>
                        {pages.map((page: string) => (
                            <ListItem key={page} disablePadding>
                                <Link href={page == 'home'? '/' : `/${page}`} onClick={handleClose}>
                                    <ListItemText primary={page} className='uppercase p-4 hover:text-primary' />
                                </Link>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </React.Fragment>
    );
}
