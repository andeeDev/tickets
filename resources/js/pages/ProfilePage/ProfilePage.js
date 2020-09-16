import React from 'react';

import Header from "../../components/Header/Header";
import Profile from "../../components/Profile/Profile";

const ProfilePage = () => {
    console.log("MIX_SENTRY_DSN_PUBLIC", process.env.MIX_SENTRY_DSN_PUBLIC);

    return (
        <div>
            <Header />
            <Profile/>
        </div>
    );
}

export default ProfilePage;
