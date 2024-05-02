import { FormControl, FormLabel, Stack, TextField, Typography } from '@mui/material'
import React from 'react'

export default function page() {
  return (
    <Stack>
        <Stack>
            <Typography>Netmask</Typography>
            <Typography>Bienvenido al WIFI</Typography>
        </Stack>
        <Stack>
            <FormControl>
                <FormLabel>Nombres:</FormLabel>
                <TextField id="outlined-basic" label="Outlined" variant="outlined" />
            </FormControl>
        </Stack>
    </Stack>
  )
}
