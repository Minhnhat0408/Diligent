import classNames from 'classnames/bind';
import styles from './ChatItem.module.scss';
import Image from '../Image/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckDouble, faFile, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { isImageUrl, isVideoUrl } from '~/utils/checkFile';
import Tippy from '@tippyjs/react';
import { useState } from 'react';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/Context';

const cx = classNames.bind(styles);

function ChatItem({ data, me }) {
    const [preview, setPreview] = useState(-1);
    const context = useContext(ThemeContext)
    return (
        <div className={cx('chat-item', { right: me, left: !me,dark: context.theme === 'dark' })}>
            <div className={cx('user-info')}>
                <Image src={data.ava} alt="ava" className={cx('ava')} />
                <div className={cx('column')}>
                    <span className={cx('name')}>{data.name}</span>
                    <div className={cx('row')}>
                        <p className={cx('time')}>{new Date(data?.time?.toMillis()).toLocaleTimeString()}</p>
                        <FontAwesomeIcon icon={faCheckDouble} className={cx('icon', { 'd-none': !data.seen })} />
                    </div>
                </div>
            </div>
            <Tippy
                placement={me ? 'left' : 'right'}
                theme={context.theme}
                allowHTML
                content={
                    <p className={cx('time-tippy',{dark:context.theme ==='dark'})}>
                        {new Date(data?.time?.toMillis()).toLocaleTimeString()}{' '}
                        {me && (
                            <FontAwesomeIcon icon={faCheckDouble} className={cx('icon', { 'd-none': !data.seen })} />
                        )}
                    </p>
                }
            >
                {typeof data.content === 'string' ? (
                    data.content === ':)' ? (
                        <div className={cx('emoji')}>
                            <FontAwesomeIcon icon={faThumbsUp} />
                        </div>
                    ) : (
                        <pre className={cx('message')}>{data.content}</pre>
                    )
                ) : data.content.media.length > 0 ? (
                    <div className={cx('image-holders')}>
                        {data.content.media.map((file, id) => {
                            const url = file.url;
                            let result = undefined;
                            if (isImageUrl(url)) {
                                result = (
                                    // trao doi vi tri anh
                                    <div
                                        key={id}
                                        className={cx('image-box', {
                                            plenty: data.content.media.length > 2,
                                        })}
                                        onClick={() => setPreview(id)}
                                    >
                                        <Image
                                            src={url}
                                            alt="preview"
                                            className={cx('image', {
                                                plenty: data.content.media.length > 2,
                                            })}
                                        />
                                    </div>
                                );
                            } else if (isVideoUrl(url)) {
                                result = (
                                    <div
                                        key={id}
                                        className={cx('image-box', {
                                            plenty: data.content.media.length > 2,
                                        })}
                                    >
                                        <video
                                            controls
                                            className={cx('image', {
                                                plenty: data.content.media.length > 2,
                                            })}
                                        >
                                            <source src={url} />
                                        </video>
                                    </div>
                                );
                            }
                            return result;
                        })}
                    </div>
                ) : (
                    <div className={cx('image-holders')}>
                        {data.content.others.map((o, id) => {
                            return (
                                <div key={id} className={cx('content')}>
                                    <FontAwesomeIcon icon={faFile} className={cx('file-icon')} />
                                    <a href={o.url} target="_blank" download={o.name} className={cx('file-name')}>
                                        {o.name}
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Tippy>
            {preview > -1 && (
                <div className={cx('pop-up')} onClick={() => setPreview(-1)}>
                    <Image src={data.content.media[preview].url} className={cx('preview')} alt="preview" />
                </div>
            )}
        </div>
    );
}

export default ChatItem;
