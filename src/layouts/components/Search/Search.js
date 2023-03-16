import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faSpinner, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import styles from './Search.module.scss';
import { Wrapper as PopperWrapper } from '~/component/Popper';
import AccountItem from '~/component/AccountItem';
import { useDebounce } from '~/hooks';
import { search } from '~/services/searchService';

const cx = classNames.bind(styles);
function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(true);
    const [loading, setLoading] = useState(false);
    const debounce = useDebounce(searchValue, 1000);
    const inputRef = useRef();
    // khi call API tim kiem co ket qua
    useEffect(() => {
        if (searchValue.trim()) {
            setLoading(true);
            const fetchData = async () => {
                console.log('hello')
                await search(debounce)
                setTimeout(() => {
                 
                    setLoading(false);
                }, 500);
            }
            fetchData(); 
        } else {
            setLoading(false);
            setSearchResult([]);
        }
    }, [debounce]);

    const handleSearch = (e) => {
        const value = e.target.value
        if(!value.startsWith(' ')){
            setSearchValue(value)
        }
    }
    const handleClear = () => {
        setSearchValue('');
        setSearchResult([]);
        inputRef.current.focus();
    };

    const handleHideResult = () => {
        setShowResult(false);
    };
    return (
        <HeadlessTippy
            visible={showResult && searchResult.length > 0}
            interactive={true}
            appendTo={() => document.body}
            render={(attrs) => (
                <div tabIndex="-1" {...attrs} className={cx('search-result')}>
                    <PopperWrapper>
                        <h4 className={cx('search-title')}>Account</h4>
                        {searchResult.map((user, index) => {
                       
                            return <AccountItem key={user.id} data= {user} />;
                        })}
                    </PopperWrapper>
                </div>
            )}
            onClickOutside={handleHideResult}
        >
            <div className={cx('search')}>
                <input
                    ref={inputRef}
                    value={searchValue}
                    placeholder="Search accounts and videos"
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
