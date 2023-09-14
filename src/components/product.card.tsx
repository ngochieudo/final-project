import { Button, Card, CardActions, CardContent, CardMedia, Divider, Rating, Typography } from "@mui/material"
export default function ProductCard() {
    return (
        <Card className="w-[30%] max-lg:w-1/2 rounded-[20px]">
            <CardMedia
                sx={{ height: 200 }}
                image="./images/lat-8644.png"
                title="green iguana"
            />
            
            <CardContent>
                <Rating name="read-only" value={3} readOnly size="small"/>
                <Typography gutterBottom variant="h5" component="div">
                    Tour Da Lat 3 ngay 2 dem
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Da Nang, Vietnam
                </Typography>
            </CardContent>
            <Divider sx={{width: '90%', marginLeft: '5%'}}/>
            <CardContent>
                <Typography>
                    
                </Typography>
            </CardContent>
        </Card>
    )
}