import Link, {LinkProps} from "next/link";
import {cloneElement, ReactElement} from "react";
import {useRouter} from "next/router";

interface ActiveLinkPropos extends LinkProps {
    children: ReactElement;
    activeClassName: string;
}

export function ActiveLink({children, activeClassName, ...rest}: ActiveLinkPropos) {
    const {asPath} = useRouter();
    const className = asPath === rest.href ? activeClassName : '';

    return (
        <Link {...rest}>
            {cloneElement(children, {
                className
            })}
        </Link>
    )
}

