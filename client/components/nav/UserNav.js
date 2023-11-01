import Link from 'next/link'

const UserNav = () => {
    return (
        <div className="nav flex-column nav-pills mt-2">
            <Link href="/user">
                <span className="nav-link active">Dashboard</span>
            </Link>
           
        </div>
    )
}

export default UserNav