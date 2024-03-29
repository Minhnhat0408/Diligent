import { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faSpinner, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import styles from './Search.module.scss';
import { Wrapper as PopperWrapper } from '~/component/Popper';
import AccountItem from '~/component/AccountItem';
import { useDebounce } from '~/hooks';
import { UserAuth } from '~/contexts/authContext';
import { ThemeContext } from '~/contexts/Context';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '~/firebase';

const cx = classNames.bind(styles);
function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState({ accounts: [], posts: [] });
    const [showResult, setShowResult] = useState(true);
    const [loading, setLoading] = useState(false);
    const debounce = useDebounce(searchValue.trim(), 1000);
    const { updateUserPrefers } = UserAuth();
    const inputRef = useRef();
    const context = useContext(ThemeContext);
    // khi call API tim kiem co ket qua
    useEffect(() => {
        if (searchValue.trim()) {
            setLoading(true);
            const fetchData = async (value) => {
               
                const acc = await getDocs(query(collection(db,'users'),where('user_name','>=',value),where('user_name' ,'<=',value + "\uf8ff")))

                const searchAccount = acc.docs.map((d) => {
                    return {id:d.id,data:d.data()}
                })
                const searchPost = await getDocs(query(collection(db,'posts'),where('tags','array-contains',value)))
     
                const search = { accounts: searchAccount,posts:searchPost.docs.map((doc) => {
                    return {data:doc.data(),id:doc.id}
                })};

                setTimeout(() => {
                    setSearchResult(search);
                    setLoading(false);
                    if(search.posts.length > 0 ){
                        updateUserPrefers('search',[value])
                    }
                }, 500);
            };
            fetchData(debounce);
        } else {
            setLoading(false);
            setSearchResult({ accounts: [],posts: []});
        }
       
    }, [debounce]);
    const handleSearch = (e) => {
        const value = e.target.value;
        if (!value.startsWith(' ')) {
            setSearchValue(value);
        }
    };
    const handleClear = () => {
        setSearchValue('');
        setSearchResult({ accounts: [],posts: []});
        inputRef.current.focus();
    };

    const handleHideResult = () => {
        setShowResult(false);
    };
 
    return (
        <HeadlessTippy
            visible={showResult && (searchResult.accounts.length > 0 || searchResult.posts.length > 0)}
            interactive={true}
            appendTo={() => document.body}
            render={(attrs) => (
                <div tabIndex="-1" {...attrs} className={cx('search-result')}>
                    <PopperWrapper className={context.theme === 'dark' ? [context.theme] : ''}>
                        <h4 className={cx('search-title', { dark: context.theme === 'dark' })}>Account</h4>
                        {searchResult.accounts.length > 0 ? searchResult.accounts.map((user, id) => {
                            if (id > 4) {
                                return null;
                            }

                            return <AccountItem key={user.id} search acc={user} dark={context.theme === 'dark'} />;
                        }) :<p className='text-center py-2 underline '>No results found</p> }
                        <h4 className={cx('search-title', { dark: context.theme === 'dark' })}>Posts</h4>
                        {searchResult.posts.length > 0 ? searchResult.posts.map((post, id) => {
                            
                            
                            return (
                                <Link
                                    className={cx('posts', { dark: context.theme === 'dark' })}
                                    to={routes.post + post.id}
                                >
                                    <span className={cx('title')}>{post.data.title}</span>
                                    <div className={cx('tags')}>
                                        {post.data.tags.length > 0 &&
                                            post.data.tags.map((tag) => {
                                                return <div className={cx('first-tag')}>{tag}</div>;
                                            })}
                                    </div>
                                </Link>
                            );
                        }) : <p className='text-center py-2 underline '>No results found</p>}
                    </PopperWrapper>
                </div>
            )}
            onClickOutside={handleHideResult}
        >
            <div className={cx('search', { dark: context.theme === 'dark' }) + ' mdl-max:hidden'}>
                <input
                    ref={inputRef}
                    value={searchValue}
                    placeholder="Search accounts and posts"
                    spellCheck="false"
                    onChange={handleSearch}
                    onFocus={() => setShowResult(true)}
                ></input>

                {loading && <FontAwesomeIcon icon={faSpinner} className={cx('spinner')}></FontAwesomeIcon>}
                {!!searchValue && !loading && (
                    <button className={cx('clear')} onClick={handleClear}>
                        <FontAwesomeIcon icon={faCircleXmark}></FontAwesomeIcon>
                    </button>
                )}

                <button className={cx('search-button')} onMouseDown={(e) => e.preventDefault()}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} className={cx('search-icon')}></FontAwesomeIcon>
                </button>
            </div>
        </HeadlessTippy>
    );
}

export default Search;
