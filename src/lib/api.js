const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const API = {
    roles: `${BASE_URL}/roles`,
    users: `${BASE_URL}/users`,
    facilities: `${BASE_URL}/facilities`,
    finance_categories: `${BASE_URL}/finance-categories`,
    finance_incomes: `${BASE_URL}/finance-incomes`,
    finance_expenses: `${BASE_URL}/finance-expenses`,
    finance_recapitulations: `${BASE_URL}/finance-recapitulations`,
    news_categories: `${BASE_URL}/news-categories`,
    news: `${BASE_URL}/news`,
    comments: `${BASE_URL}/comments`,
};

export default API;