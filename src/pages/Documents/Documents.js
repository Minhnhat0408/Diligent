import classNames from 'classnames/bind';
import styles from './Documents.module.scss';
import { useRef, useState } from 'react';
import { UserAuth } from '~/contexts/authContext';
import DocumentItem from '~/component/DocumentItem/DocumentItem';
import Button from '~/component/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faCircleXmark,
    faFilePen,
    faFilter,
    faMagnifyingGlass,
    faSearch,
    faSpinner,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';
import DocumentForm from '~/component/DocumentForm/DocumentForm';
import { useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '~/firebase';
import { useNavigate } from 'react-router-dom';
import routes from '~/config/routes';
import Menu from '~/component/Popper/Menu/Menu';
import { CATEGORY_OPTIONS, FILTER_OPTIONS } from '~/utils/constantValue';
import { useDebounce } from '~/hooks';
const cx = classNames.bind(styles);

function Documents() {
    const [uploadFileBox, setUploadFileBox] = useState(false);
    const [documents, setDocuments] = useState();
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const debounce = useDebounce(searchValue, 1000);
    const [animation, setAnimation] = useState(false);
    const inputRef = useRef();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [filter, setFilter] = useState(FILTER_OPTIONS);
    const { user } = UserAuth();
    const navigate = useNavigate();
    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(db, 'documents')), async (docs) => {
            let tmp = [];
            docs.forEach((doc) => {
                tmp.push({ id: doc.id, data: doc.data() });
            });
            setDocuments({ origin: tmp, display: tmp });
        });
        return () => unsubscribe();
    }, []);
    const context = useContext(ThemeContext);
    const onAnimationEnd = () => {
        if (!animation) {
            setSearchValue('');
            setShowSearchBar(false);
        }
    };
    useEffect(() => {
        if (searchValue.trim()) {
            setLoading(true);
            const fetchData = (value) => {
                const search = documents.display.filter((file) => {
                    return file.data.title.toLowerCase().includes(value.toLowerCase());
                });
                setTimeout(() => {
                    setDocuments({ origin: documents.origin, display: search });
                    setLoading(false);
                }, 500);
            };
            fetchData(searchValue.trim());
        } else {
            setLoading(false);
        }
    }, [debounce]);
    useEffect(() => {
        if (animation) setShowSearchBar(true);
    }, [animation]);
    useEffect(() => {
        if (documents) {
            setDocuments({
                origin: documents.origin,
                display: documents.origin.filter((obj) => {
                    return selectedCategories.every((value) => {
                        return obj.data.tag.indexOf(value) !== -1;
                    });
                }),
            });
        }
    }, [selectedCategories]);
    const handleAddCategory = (value) => {
        console.log('fsdafs');
        if (!selectedCategories.includes(value.title)) {
            setSelectedCategories([...selectedCategories, value.title]);
        } else {
            return;
        }
    };
    const handleDeleteCategory = (value) => {
        setSelectedCategories(selectedCategories.filter((category) => category !== value));
    };
    const handleFilter = (item) => {
        switch (item.type) {
            case 'latest':
                setDocuments({
                    origin: documents.origin,
                    display: documents.display.sort((a, b) => b.data.createdAt.seconds - a.data.createdAt.seconds),
                });
                break;
            case 'oldest':
                setDocuments({
                    origin: documents.origin,
                    display: documents.display.sort((a, b) => a.data.createdAt.seconds - b.data.createdAt.seconds),
                });
                break;
            case 'downloads':
                setDocuments({
                    origin: documents.origin,
                    display: documents.display.sort((a, b) => b.data.downloads - a.data.downloads),
                });
                break;
            default:
                break;
        }
        let tmp = filter;
        tmp.forEach((a, ind) => {
            if (!a.children) {
                if (a === item) {
                    a.tick = true;
                } else if (a.tick === true) {
                    a.tick = false;
                }
            } else {
                if (a !== item) {
                    a.tick = false;
                    a.children.data.forEach((b) => {
                        if (b === item) {
                            b.tick = !b.tick;
                            a.tick = b.tick;
                        } else if (b.tick === true) {
                            b.tick = false;
                        }
                    });
                }
            }
        });
        setFilter(tmp);
    };
    const handleSearch = (e) => {
        const value = e.target.value;
        if (!value.startsWith(' ')) {
            setSearchValue(value);
        }
    };
    const handleClear = () => {
        setSearchValue('');
        setSelectedCategories([])
        setDocuments({origin:documents.origin,display:documents.origin})
        inputRef.current.focus();
    };
    return (
        <div className={cx('wrapper', { dark: context.theme === 'dark' })}>
            <div className={cx('user-options')}>
                <h4 className={cx('title')}>Document</h4>
                <p className={cx('description')}>"Constructive and helpful files from all around the globe"</p>
                <div className={cx('row')}>
                    <Button
                        dark={context.theme === 'dark'}
                        onClick={() => (user ? setUploadFileBox(true) : navigate(routes.login))}
                        outline
                    >
                        <FontAwesomeIcon icon={faFilePen} className={cx('icon')} />
                    </Button>
                    <Button dark={context.theme === 'dark'} onClick={() => setAnimation(!animation)} outline>
                        <FontAwesomeIcon icon={faSearch} className={cx('icon')} />
                    </Button>
                </div>
                <div className={cx('row')}>
                    <Menu
                        offset={[0, 30]}
                        // chinh ben trai / chieu cao so vs ban dau
                        placement="left"
                        item={filter}
                        medium
                        onClick={handleFilter}
                    >
                        <Button dark={context.theme === 'dark'} outline>
                            <FontAwesomeIcon icon={faFilter} className={cx('icon')} />
                        </Button>
                    </Menu>
                    <Menu
                        offset={[0, 30]}
                        // chinh ben trai / chieu cao so vs ban dau
                        placement="right"
                        item={CATEGORY_OPTIONS}
                        small
                        onClick={handleAddCategory}
                    >
                        <Button dark={context.theme === 'dark'} outline>
                            <FontAwesomeIcon icon={faBars} className={cx('icon')} />
                        </Button>
                    </Menu>
                </div>

                {uploadFileBox && <DocumentForm onXmark={setUploadFileBox} />}
            </div>

            <div className={cx('content')}>
                {showSearchBar && (
                    <div
                        className={cx('search', { dark: context.theme === 'dark', show: animation, hide: !animation })}
                        onAnimationEnd={onAnimationEnd}
                    >
                        <input
                            ref={inputRef}
                            value={searchValue}
                            placeholder="Search documents here"
                            spellCheck="false"
                            onChange={handleSearch}
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
                )}

                {selectedCategories.length !== 0 && (
                    <ul className={cx('selected-category')}>
                        {selectedCategories.map((category, index) => (
                            <li key={index} onClick={() => handleDeleteCategory(category)}>
                                <p>{category}</p>
                                <FontAwesomeIcon icon={faXmark} />
                            </li>
                        ))}
                    </ul>
                )}
                {documents?.display.map((doc) => {
                    return <DocumentItem key={doc.id} id={doc.id} data={doc.data} />;
                })}
            </div>
        </div>
    );
}

export default Documents;
