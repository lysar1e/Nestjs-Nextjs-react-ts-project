import React from 'react'
import { Link } from 'react-router-dom';
import { UsersOptions } from '../App'


interface Props {
    users: UsersOptions[];
}
export const UsersList: React.FC<Props> = ({users}) => {
    return (
        <div className="container">
            <h3>Найдено пользователей: {users.length}</h3>
            <div className="collection">
                {users.map((user) => {
                    return (
                        <Link
                            key={user._id}
                            to={`/profile/${user.username}`}
                            className="collection-item"
                        >
                            {user.username}
                        </Link>
                    );
                })}
            </div>
        </div>
    )
}