import React from 'react';
import ArcadeGif from '../assets/arcade-machine.mp4';
import HomeActions from '../containers/HomeActions';

const Home: React.FC = () => {
    return (
        <div className="flex items-start justify-center p-8 gap-20">
            <div className="relative">
                <video src={ArcadeGif} muted className="w-75" />
            </div>
            <HomeActions />
        </div>
    );
};

export default Home;