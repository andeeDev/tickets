import React from "react";
import './header.css';
import Logo from './Logo.svg';
import {Link} from "react-router-dom";
import request from "../../services/request";
import {clearStorage} from '../../persistentStore/persistenStore';
import {useHistory} from "react-router";
import {connect} from "react-redux";

const Header = ({user, access_token, logoutFetch, logoutSuccess, logoutFail, ...pro}) => {
    console.log(pro);

    const history = useHistory();
    const logout = async (e) => {
        logoutFetch({
            type: 'LOGOUT_TOKEN_REQUEST'
        });
        e.preventDefault();
        try {
            console.log(access_token);
            const response = await request({
                method: 'post',
                url: 'auth/logout',
                data: {
                    access_token: access_token
                }
            });
            if(response.status === 200) {
                logoutSuccess({
                    type: 'LOGOUT_TOKEN_SUCCESS'
                });
                clearStorage();
                history.push('/login');
            }
        } catch (e) {
            logoutFail({
                type: 'LOGOUT_TOKEN_FAILURE',
                payload: e
            })
            console.log(e);
        }

    }
    return (
        <header className='header__wrapper'>
            <nav className='header__navigation'>
                <div className='header__links-wrapper'>
                    <img className='header__logo' width={'300px'} src={Logo}  alt='Bug system logo'/>
                    <ul className='header__links-list'>
                    <li className='header__list-item'>
                        <Link className='header__link' to={'projects'} >Projects</Link>
                    </li>
                    <li className='header__list-item'>
                        <Link className='header__link' to={'tickets'} >Tickets</Link>
                    </li>
                </ul>
                </div>
                <ul className='header__user-list'>
                    <li className='header__list-item header__user-item'>
                        <Link className='header__link ' to={'profile'} >
                            <img className='header__profile-image'
                                 src={
                                     user.image?
                                         `/storage/${user.image}`:
                                         `/img/user-profile-photo.png`
                                 }
                                 width={"20px"} height={'20px'}
                                 alt='user profile photo'/>
                            <span className='header__user-name'>{user.name}</span>
                        </Link>
                    </li>
                    <li className='header__list-item'>
                        <a href='#' className='header__link' onClick={logout} >Log out</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}



function mapStateToProps(state) {
    return {
        access_token: state.auth.tokens.access_token,
        user: state.auth.user
    };
}
function mapDispatchToProps(dispatch) {
    return({
        logoutFetch: () => {dispatch({
            type: 'LOGOUT_TOKEN_REQUEST'
        })},
        logoutSuccess: () => dispatch({
           type: 'LOGOUT_TOKEN_SUCCESS'
        }),
        logoutFail: (e) => dispatch({
            type: 'LOGOUT_TOKE_FAILURE',
            payload: e
        })
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(Header);
