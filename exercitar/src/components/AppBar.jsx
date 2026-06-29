//AppBar.jsx
import * as React from 'react';
import {AppBar,Box,Toolbar,IconButton,Typography,Menu,Container,Avatar,Tooltip,MenuItem} from '@mui/material';



const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function AppBarComponent() {
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    };

    return(
        <AppBar position="static">
            <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ width: '100%', justifyContent: 'space-between' }}>
                <img src="/logo_semfundo.png" alt="Logo" style={{ height: '40px', marginRight: '8px' }} />
                <Typography
                    variant="h6"
                    noWrap
                    component="p"
                    href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            BEM VINDO AO MeuRITMO!
          </Typography>
        
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    );
}
