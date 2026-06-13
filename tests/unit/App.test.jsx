import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../src/App';

// Mock Recharts to avoid layout issues in JSDOM
jest.mock('recharts', () => ({
    ResponsiveContainer: ({ children }) => <div data-testid="ResponsiveContainer">{children}</div>,
    LineChart: ({ children }) => <div data-testid="LineChart">{children}</div>,
    Line: () => <div data-testid="Line" />,
    BarChart: ({ children }) => <div data-testid="BarChart">{children}</div>,
    Bar: () => <div data-testid="Bar" />,
    PieChart: ({ children }) => <div data-testid="PieChart">{children}</div>,
    Pie: () => <div data-testid="Pie" />,
    Cell: () => <div data-testid="Cell" />,
    XAxis: () => <div data-testid="XAxis" />,
    YAxis: () => <div data-testid="YAxis" />,
    CartesianGrid: () => <div data-testid="CartesianGrid" />,
    Tooltip: () => <div data-testid="Tooltip" />,
    Legend: () => <div data-testid="Legend" />,
    AreaChart: ({ children }) => <div data-testid="AreaChart">{children}</div>,
    Area: () => <div data-testid="Area" />,
}));

beforeAll(() => {
    global.fetch = jest.fn((url) => {
        if (url.includes('test.php')) {
            return Promise.resolve({
                json: () => Promise.resolve({ message: "Backend Connected" }),
            });
        }
        if (url.includes('get_student.php')) {
            return Promise.resolve({
                json: () => Promise.resolve({
                    success: true,
                    student: {
                        name: "Sri Rakesh. R",
                        roll_No: "10A-04",
                        class_name: "10",
                        section: "A",
                        dob: "2011-03-15",
                        parent_name: "Rajesh",
                        parent_email: "rajesh@email.com",
                        academic_year: "2025-26"
                    }
                }),
            });
        }
        return Promise.resolve({
            json: () => Promise.resolve({ success: true, name: "Rejina", role: "Parent" }),
        });
    });
    window.alert = jest.fn();
});

afterAll(() => {
    jest.restoreAllMocks();
});

const loginUser = async () => {
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const pwdInput = screen.getByPlaceholderText('••••••••');
    fireEvent.change(emailInput, { target: { value: 'parent@sunriseacademy.edu' } });
    fireEvent.change(pwdInput, { target: { value: 'password123' } });
    const submitBtn = screen.getByRole('button', { name: /Sign In/i });
    fireEvent.click(submitBtn);
    await waitFor(() => {
        expect(screen.getByText(/Good morning,/i)).toBeInTheDocument();
    });
};

const navigateTo = (tabLabel) => {
    const sidebar = document.querySelector('aside');
    const tabBtn = within(sidebar).getByText(tabLabel);
    fireEvent.click(tabBtn);
};

const mainContent = () => within(document.querySelector('main'));

describe('ProgressView Unique Tests (120+ Cases)', () => {

    describe('1. Login Screen Basic Elements', () => {
        it('1.1 Should render main application title', () => {
            render(<App />);
            expect(screen.getByText('Progress View')).toBeInTheDocument();
        });

        it('1.2 Should render portal identification text', () => {
            render(<App />);
            expect(screen.getByText('Sunrise Academy · Parent Portal')).toBeInTheDocument();
        });

        it('1.3 Should render account sign-in prompt header', () => {
            render(<App />);
            expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
        });

        it('1.4 Should render email address input label', () => {
            render(<App />);
            expect(screen.getByText('Email address')).toBeInTheDocument();
        });

        it('1.5 Should render correct email input placeholder text', () => {
            render(<App />);
            expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
        });

        it('1.6 Should render password input label text field', () => {
            render(<App />);
            expect(screen.getByText('Password')).toBeInTheDocument();
        });

        it('1.7 Should render correct password input placeholder text representation', () => {
            render(<App />);
            expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
        });

        it('1.8 Should render remember me text selection checkbox label', () => {
            render(<App />);
            expect(screen.getByLabelText(/Remember me/i)).toBeInTheDocument();
        });

        it('1.9 Should render forgot password clickable link element', () => {
            render(<App />);
            expect(screen.getByText('Forgot password?')).toBeInTheDocument();
        });

        it('1.10 Should render submit sign in button', () => {
            render(<App />);
            expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
        });

        it('1.11 Should render support help footer guidance text', () => {
            render(<App />);
            expect(screen.getByText('For account assistance, contact the school office.')).toBeInTheDocument();
        });

        it('1.12 Should render copyright declaration string', () => {
            render(<App />);
            expect(screen.getByText('© 2025 Sunrise Academy. All rights reserved.')).toBeInTheDocument();
        });

        it('1.13 Should render password field as type password by default', () => {
            render(<App />);
            const pwdField = screen.getByPlaceholderText('••••••••');
            expect(pwdField).toHaveAttribute('type', 'password');
        });

        it('1.14 Should switch password element type to text when toggle button is clicked', () => {
            render(<App />);
            const pwdField = screen.getByPlaceholderText('••••••••');
            const toggle = screen.getByText('👁');
            fireEvent.click(toggle);
            expect(pwdField).toHaveAttribute('type', 'text');
        });

        it('1.15 Should revert password element to hidden format when toggle clicked again', () => {
            render(<App />);
            const pwdField = screen.getByPlaceholderText('••••••••');
            const toggle = screen.getByText('👁');
            fireEvent.click(toggle); // Make visible
            const hideToggle = screen.getByText('🙈');
            fireEvent.click(hideToggle); // Make hidden
            expect(pwdField).toHaveAttribute('type', 'password');
        });
    });

    describe('2. Login Screen Logic & Interactions', () => {
        it('2.1 Should accept standard valid email string', () => {
            render(<App />);
            const emailField = screen.getByPlaceholderText('you@example.com');
            fireEvent.change(emailField, { target: { value: 'user@sunrise.edu' } });
            expect(emailField.value).toBe('user@sunrise.edu');
        });

        it('2.2 Should accept second alternative valid format input', () => {
            render(<App />);
            const emailField = screen.getByPlaceholderText('you@example.com');
            fireEvent.change(emailField, { target: { value: 'alternative@domain.com' } });
            expect(emailField.value).toBe('alternative@domain.com');
        });

        it('2.3 Should accept single test instance of invalid email structure', () => {
            render(<App />);
            const emailField = screen.getByPlaceholderText('you@example.com');
            fireEvent.change(emailField, { target: { value: 'invalid_email_format' } });
            expect(emailField.value).toBe('invalid_email_format');
        });

        it('2.4 Should accept single test instance of short password characters', () => {
            render(<App />);
            const pwdField = screen.getByPlaceholderText('••••••••');
            fireEvent.change(pwdField, { target: { value: '123' } });
            expect(pwdField.value).toBe('123');
        });

        it('2.5 Should show credentials validation error message when submit is clicked with empty inputs', async () => {
            render(<App />);
            const emailField = screen.getByPlaceholderText('you@example.com');
            const pwdField = screen.getByPlaceholderText('••••••••');
            fireEvent.change(emailField, { target: { value: '' } });
            fireEvent.change(pwdField, { target: { value: '' } });
            const button = screen.getByRole('button', { name: /Sign In/i });
            fireEvent.click(button);
            expect(await screen.findByText('Please enter your credentials.')).toBeInTheDocument();
        });

        it('2.6 Should show appropriate error message when backend connection encounters rejection', async () => {
            global.fetch.mockImplementationOnce(() => Promise.reject("Network Issue"));
            render(<App />);
            const emailField = screen.getByPlaceholderText('you@example.com');
            const pwdField = screen.getByPlaceholderText('••••••••');
            fireEvent.change(emailField, { target: { value: 'abc@example.com' } });
            fireEvent.change(pwdField, { target: { value: 'xyz123' } });
            const button = screen.getByRole('button', { name: /Sign In/i });
            fireEvent.click(button);
            expect(await screen.findByText('Could not connect to the server.')).toBeInTheDocument();
        });

        it('2.7 Should show message when credentials do not match backend database records', async () => {
            global.fetch.mockImplementationOnce(() => Promise.resolve({
                json: () => Promise.resolve({ success: false, message: 'Invalid credentials. Please try again.' }),
            }));
            render(<App />);
            const emailField = screen.getByPlaceholderText('you@example.com');
            const pwdField = screen.getByPlaceholderText('••••••••');
            fireEvent.change(emailField, { target: { value: 'wrong@school.org' } });
            fireEvent.change(pwdField, { target: { value: 'wrongpass' } });
            const button = screen.getByRole('button', { name: /Sign In/i });
            fireEvent.click(button);
            expect(await screen.findByText('Invalid credentials. Please try again.')).toBeInTheDocument();
        });

        it('2.8 Should trigger browser window alert on login verification success', async () => {
            render(<App />);
            await loginUser();
            expect(window.alert).toHaveBeenCalledWith("Welcome Rejina");
        });

        it('2.9 Should cache user credentials/details name locally on successful authentication', () => {
            expect(localStorage.getItem('userName')).toBe('Rejina');
        });

        it('2.10 Should cache user role details level locally on successful authentication', () => {
            expect(localStorage.getItem('userRole')).toBe('Parent');
        });
    });

    describe('3. Dashboard Screen Details', () => {
        beforeEach(async () => {
            render(<App />);
            await loginUser();
        });

        it('3.1 Should display good morning user text greeting', () => {
            expect(mainContent().getByText('Good morning,')).toBeInTheDocument();
        });

        it('3.2 Should display welcome username text greeting', () => {
            expect(mainContent().getByText('Rejina 👋')).toBeInTheDocument();
        });

        it('3.3 Should render attendance metric value stat box', () => {
            expect(mainContent().getAllByText('92%')[0]).toBeInTheDocument();
        });

        it('3.4 Should render latest test marks stat representation', () => {
            expect(mainContent().getByText('87/100')).toBeInTheDocument();
        });

        it('3.5 Should render average performance stat card metric value', () => {
            expect(mainContent().getByText('83%')).toBeInTheDocument();
        });

        it('3.6 Should render pending tasks count stat box indicator', () => {
            expect(mainContent().getByText('3')).toBeInTheDocument();
        });

        it('3.7 Should render announcements notifications count widget indicator', () => {
            expect(mainContent().getAllByText('2')[0]).toBeInTheDocument();
        });

        it('3.8 Should render performance line chart container element tag', () => {
            expect(mainContent().getAllByTestId('LineChart')[0]).toBeInTheDocument();
        });

        it('3.9 Should render attendance breakdown pie chart element tag', () => {
            expect(mainContent().getByTestId('PieChart')).toBeInTheDocument();
        });

        it('3.10 Should display recent activity log section header', () => {
            expect(mainContent().getByText('Recent Activity')).toBeInTheDocument();
        });
    });

    describe('4. Student Profile Tab', () => {
        beforeEach(async () => {
            render(<App />);
            await loginUser();
            navigateTo('Student Profile');
            await waitFor(() => {
                expect(screen.queryByText('Loading student profile...')).not.toBeInTheDocument();
            });
        });

        it('4.1 Should load the student profile layout header', () => {
            expect(mainContent().getByRole('heading', { name: 'Student Profile', level: 2 })).toBeInTheDocument();
        });

        it('4.2 Should render student name retrieved from API mock database', async () => {
            expect(await mainContent().findByText('Sri Rakesh. R')).toBeInTheDocument();
        });

        it('4.3 Should render roll number retrieved from mock request details', () => {
            expect(mainContent().getByText('Roll No: 10A-04')).toBeInTheDocument();
        });

        it('4.4 Should render class and section details badge text representation', () => {
            expect(mainContent().getByText('Class 10 – Section A')).toBeInTheDocument();
        });

        it('4.5 Should display correct academic year profile item', () => {
            expect(mainContent().getByText('2025-26')).toBeInTheDocument();
        });

        it('4.6 Should display formatted date of birth info item', () => {
            expect(mainContent().getByText('15/3/2011')).toBeInTheDocument();
        });

        it('4.7 Should display parent name info item details', () => {
            expect(mainContent().getByText('Rajesh')).toBeInTheDocument();
        });

        it('4.8 Should display parent email address details', () => {
            expect(mainContent().getByText('rajesh@email.com')).toBeInTheDocument();
        });

        it('4.9 Should render overview details card header', () => {
            expect(mainContent().getByText('Subject Performance Overview')).toBeInTheDocument();
        });

        it('4.10 Should list achievements check item listings', () => {
            expect(mainContent().getByText('Recent Achievements')).toBeInTheDocument();
        });
    });

    describe('5. Attendance Tab', () => {
        beforeEach(async () => {
            render(<App />);
            await loginUser();
            navigateTo('Attendance');
        });

        it('5.1 Should render page title header element', () => {
            expect(mainContent().getByRole('heading', { name: 'Attendance', level: 2 })).toBeInTheDocument();
        });

        it('5.2 Should render total academic school days stat value label', () => {
            expect(mainContent().getByText('15')).toBeInTheDocument();
        });

        it('5.3 Should render count of days present stat label', () => {
            expect(mainContent().getByText('11')).toBeInTheDocument();
        });

        it('5.4 Should render count of days absent stat label', () => {
            expect(mainContent().getAllByText('2')[0]).toBeInTheDocument();
        });

        it('5.5 Should render count of days marked late stat label', () => {
            expect(mainContent().getAllByText('13%')[0]).toBeInTheDocument();
        });

        it('5.6 Should render monthly breakdown bar chart wrapper element', () => {
            expect(mainContent().getByTestId('BarChart')).toBeInTheDocument();
        });

        it('5.7 Should render monthly breakdown chart container reference key', () => {
            expect(mainContent().getAllByTestId('ResponsiveContainer')[0]).toBeInTheDocument();
        });

        it('5.8 Should render daily logs dashboard header card info', () => {
            expect(mainContent().getByText('Daily Attendance Log')).toBeInTheDocument();
        });

        it('5.9 Should render first daily log attendance card item date representation', () => {
            expect(mainContent().getByText('2 Jun')).toBeInTheDocument();
        });

        it('5.10 Should render second daily log attendance card item date representation', () => {
            expect(mainContent().getByText('3 Jun')).toBeInTheDocument();
        });
    });

    describe('6. Daily Tests Tab', () => {
        beforeEach(async () => {
            render(<App />);
            await loginUser();
            navigateTo('Daily Tests');
        });

        it('6.1 Should display daily tests main page header', () => {
            expect(mainContent().getByRole('heading', { name: 'Daily Tests', level: 2 })).toBeInTheDocument();
        });

        it('6.2 Should display subject selection filter button All', () => {
            expect(mainContent().getByRole('button', { name: 'All' })).toBeInTheDocument();
        });

        it('6.3 Should display subject selection filter button Mathematics', () => {
            expect(mainContent().getByRole('button', { name: 'Mathematics' })).toBeInTheDocument();
        });

        it('6.4 Should display subject selection filter button Science', () => {
            expect(mainContent().getByRole('button', { name: 'Science' })).toBeInTheDocument();
        });

        it('6.5 Should display subject selection filter button English', () => {
            expect(mainContent().getByRole('button', { name: 'English' })).toBeInTheDocument();
        });

        it('6.6 Should display subject selection filter button Social Studies', () => {
            expect(mainContent().getByRole('button', { name: 'Social Studies' })).toBeInTheDocument();
        });

        it('6.7 Should display subject selection filter button Computer Science', () => {
            expect(mainContent().getByRole('button', { name: 'Computer Science' })).toBeInTheDocument();
        });

        it('6.8 Should display subject selection filter button Tamil', () => {
            expect(mainContent().getByRole('button', { name: 'Tamil' })).toBeInTheDocument();
        });

        it('6.9 Should display comparison analytics bar chart title wrapper', () => {
            expect(mainContent().getByText('Subject Comparison (Avg Marks %)')).toBeInTheDocument();
        });

        it('6.10 Should display correct details for a selected mathematics test entry key', () => {
            expect(mainContent().getByText(/"Good understanding of algebra."/i)).toBeInTheDocument();
        });
    });

    describe('7. Assignments Tab', () => {
        beforeEach(async () => {
            render(<App />);
            await loginUser();
            navigateTo('Assignments');
        });

        it('7.1 Should display assignments page header', () => {
            expect(mainContent().getByRole('heading', { name: 'Assignments', level: 2 })).toBeInTheDocument();
        });

        it('7.2 Should display all assignments filter tab option text', () => {
            expect(mainContent().getByRole('button', { name: /All/i })).toBeInTheDocument();
        });

        it('7.3 Should display pending assignments filter button with count info label', () => {
            expect(mainContent().getByRole('button', { name: /Pending/i })).toBeInTheDocument();
        });

        it('7.4 Should display submitted assignments filter tab with count info tag', () => {
            expect(mainContent().getByRole('button', { name: /Submitted/i })).toBeInTheDocument();
        });

        it('7.5 Should display overdue assignments filter tab options label', () => {
            expect(mainContent().getByRole('button', { name: /Overdue/i })).toBeInTheDocument();
        });

        it('7.6 Should display assignment name details on list item card', () => {
            expect(mainContent().getByText('Quadratic Equations Practice Set')).toBeInTheDocument();
        });

        it('7.7 Should display assignment subject badge text on list item card', () => {
            expect(mainContent().getAllByText('Mathematics')[0]).toBeInTheDocument();
        });

        it('7.8 Should display due date text label details on card items list', () => {
            expect(mainContent().getByText(/Due: 15 Jun/i)).toBeInTheDocument();
        });

        it('7.9 Should display short assignment task description on details card', () => {
            expect(mainContent().getByText('Solve problems 1–30 from chapter 4.')).toBeInTheDocument();
        });

        it('7.10 Should display assignment status indicator labels correctly on cards list', () => {
            expect(mainContent().getAllByText('Pending')[0]).toBeInTheDocument();
        });
    });

    describe('8. Weekly Reports Tab', () => {
        beforeEach(async () => {
            render(<App />);
            await loginUser();
            navigateTo('Weekly Reports');
        });

        it('8.1 Should display weekly reports page header title', () => {
            expect(mainContent().getByRole('heading', { name: 'Weekly Reports', level: 2 })).toBeInTheDocument();
        });

        it('8.2 Should display button select indicator for Week 23', () => {
            expect(mainContent().getAllByText('Week 23 (Jun 3–7)')[0]).toBeInTheDocument();
        });

        it('8.3 Should display button select options label for Week 22', () => {
            expect(mainContent().getByText('Week 22 (May 27–31)')).toBeInTheDocument();
        });

        it('8.4 Should render selected week highlights main card title', () => {
            expect(mainContent().getAllByText('Week 23 (Jun 3–7)')[0]).toBeInTheDocument();
        });

        it('8.5 Should render card details of reporting teacher Ms. Priya Rajan', () => {
            expect(mainContent().getByText('By Ms. Priya Rajan')).toBeInTheDocument();
        });

        it('8.6 Should display attendance performance highlights for selected week', () => {
            expect(mainContent().getByText('4/5')).toBeInTheDocument();
        });

        it('8.7 Should display assignments completion ratio highlight details', () => {
            expect(mainContent().getByText('2/3')).toBeInTheDocument();
        });

        it('8.8 Should display subject count highlight value for reporting period', () => {
            expect(mainContent().getAllByText('4')[0]).toBeInTheDocument();
        });

        it('8.9 Should display feedback teacher remarks section details text', () => {
            expect(mainContent().getByText(/Aryan showed strong improvement in Mathematics/i)).toBeInTheDocument();
        });

        it('8.10 Should list items describing areas of improvement', () => {
            expect(mainContent().getByText('Social Studies comprehension')).toBeInTheDocument();
        });
    });

    describe('9. Subject Performance Tab', () => {
        beforeEach(async () => {
            render(<App />);
            await loginUser();
            navigateTo('Subject Performance');
        });

        it('9.1 Should render subject performance screen header', () => {
            expect(mainContent().getByRole('heading', { name: 'Subject Performance', level: 2 })).toBeInTheDocument();
        });

        it('9.2 Should render subject tab selection tab Mathematics', () => {
            expect(mainContent().getByRole('button', { name: 'Mathematics' })).toBeInTheDocument();
        });

        it('9.3 Should render subject tab selection tab Science', () => {
            expect(mainContent().getByRole('button', { name: 'Science' })).toBeInTheDocument();
        });

        it('9.4 Should render metric score count of tests taken', () => {
            expect(mainContent().getAllByText('3')[0]).toBeInTheDocument();
        });

        it('9.5 Should render average metric percentage score', () => {
            expect(mainContent().getByText('86%')).toBeInTheDocument();
        });

        it('9.6 Should render highest score test details metric', () => {
            expect(mainContent().getAllByText('91%')[0]).toBeInTheDocument();
        });

        it('9.7 Should render lowest score test details metric', () => {
            expect(mainContent().getAllByText('79%')[0]).toBeInTheDocument();
        });

        it('9.8 Should render score history trend AreaChart graph details', () => {
            expect(mainContent().getByTestId('AreaChart')).toBeInTheDocument();
        });

        it('9.9 Should render test history details table wrapper header', () => {
            expect(mainContent().getByText('Test History – Mathematics')).toBeInTheDocument();
        });

        it('9.10 Should display exact marks value from tests lists inside the history table', () => {
            expect(mainContent().getByText('87')).toBeInTheDocument();
        });
    });

    describe('10. Yearly Progress Tab', () => {
        beforeEach(async () => {
            render(<App />);
            await loginUser();
            navigateTo('Yearly Progress');
        });

        it('10.1 Should render yearly progress layout page title', () => {
            expect(mainContent().getByRole('heading', { name: 'Yearly Progress', level: 2 })).toBeInTheDocument();
        });

        it('10.2 Should render year average grade representation indicator', () => {
            expect(mainContent().getByText('Year Average')).toBeInTheDocument();
        });

        it('10.3 Should render best subject grade representation details', () => {
            expect(mainContent().getByText('Best Subject')).toBeInTheDocument();
        });

        it('10.4 Should render annual attendance threshold validation indicator', () => {
            expect(mainContent().getByText('Annual Attendance')).toBeInTheDocument();
        });

        it('10.5 Should render trend line charts details over full year', () => {
            expect(mainContent().getAllByTestId('LineChart')[0]).toBeInTheDocument();
        });

        it('10.6 Should render strengths card information section details', () => {
            expect(mainContent().getByText('Strength Areas')).toBeInTheDocument();
        });

        it('10.7 Should render improvement areas recommendation information card title', () => {
            expect(mainContent().getByText('Areas for Improvement')).toBeInTheDocument();
        });

        it('10.8 Should render predicted score header for upcoming exams', () => {
            expect(mainContent().getByText('Predicted Half-Yearly Performance')).toBeInTheDocument();
        });

        it('10.9 Should display predicted grade calculations for math', () => {
            expect(mainContent().getByText('89%')).toBeInTheDocument();
        });

        it('10.10 Should display predicted grade details for computer science', () => {
            expect(mainContent().getByText('97%')).toBeInTheDocument();
        });
    });

    describe('11. Teacher Remarks Tab', () => {
        beforeEach(async () => {
            render(<App />);
            await loginUser();
            navigateTo('Teacher Remarks');
        });

        it('11.1 Should display teacher remarks layout screen header', () => {
            expect(mainContent().getByRole('heading', { name: 'Teacher Remarks', level: 2 })).toBeInTheDocument();
        });

        it('11.2 Should render feedback comment card from Ms. Priya Rajan', () => {
            expect(mainContent().getAllByText('Ms. Priya Rajan')[0]).toBeInTheDocument();
        });

        it('11.3 Should render feedback comment card from Mr. Venkat Rao', () => {
            expect(mainContent().getByText('Mr. Venkat Rao')).toBeInTheDocument();
        });

        it('11.4 Should render feedback comment card from Ms. Deepa Nair', () => {
            expect(mainContent().getByText('Ms. Deepa Nair')).toBeInTheDocument();
        });

        it('11.5 Should render feedback comment card from Mr. Arjun Kumar', () => {
            expect(mainContent().getByText('Mr. Arjun Kumar')).toBeInTheDocument();
        });

        it('11.6 Should render exact feedback content for school coding club recommendation', () => {
            expect(mainContent().getByText(/Aryan's Python programming skills are ahead of the class/i)).toBeInTheDocument();
        });

        it('11.7 Should display type badge labels Achievement', () => {
            expect(mainContent().getAllByText('Achievement')[0]).toBeInTheDocument();
        });

        it('11.8 Should display type badge labels Recommendation', () => {
            expect(mainContent().getByText('Recommendation')).toBeInTheDocument();
        });
    });

    describe('12. Announcements Tab', () => {
        beforeEach(async () => {
            render(<App />);
            await loginUser();
            navigateTo('Announcements');
        });

        it('12.1 Should display school announcements page title header', () => {
            expect(mainContent().getByRole('heading', { name: 'Announcements', level: 2 })).toBeInTheDocument();
        });

        it('12.2 Should render list elements displaying notice title academic releases', () => {
            expect(mainContent().getByText('Half-Yearly Examination Schedule Released')).toBeInTheDocument();
        });

        it('12.3 Should display event notice category badge tag details', () => {
            expect(mainContent().getAllByText('Event')[0]).toBeInTheDocument();
        });

        it('12.4 Should display academic notice category badge tag description details', () => {
            expect(mainContent().getByText('Academic')).toBeInTheDocument();
        });

        it('12.5 Should show exam announcements body details message text', () => {
            expect(mainContent().getByText(/Half-yearly examinations for Class 10 will be held/i)).toBeInTheDocument();
        });

        it('12.6 Should display mark as read action button on unread items', () => {
            expect(mainContent().getAllByText('Mark as read')[0]).toBeInTheDocument();
        });

        it('12.7 Should mark announcement as read when action button is clicked', () => {
            const buttonsBefore = mainContent().getAllByText('Mark as read');
            expect(buttonsBefore.length).toBe(2);
            fireEvent.click(buttonsBefore[0]);
            const buttonsAfter = mainContent().getAllByText('Mark as read');
            expect(buttonsAfter.length).toBe(1);
        });

        it('12.8 Should display unread notification circle on sidebar navigator icon badge', () => {
            expect(screen.getByText('2')).toHaveStyle('background: #DC2626');
        });
    });
});
