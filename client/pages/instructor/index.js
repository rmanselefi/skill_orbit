import axios from '../../axios/axios'

import InstructorRoute from '../../routes/InstructorRoute'

const InstructorIndex = () => {
    return (
        <InstructorRoute>
            <h1 className='jumbotron text-center square' > Instructor Dashboard</h1>
        </InstructorRoute>
    )
}
export default InstructorIndex