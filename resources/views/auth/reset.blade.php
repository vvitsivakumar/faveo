@extends('themes.default1.layouts.login')

@section('body')
 <div id="app-client-panel">
                <reset-password></reset-password>
            </div>
        </div>
        <script type="text/javascript" src="{{ bundleLink('js/lang' ) }}"></script>
        <script type="text/javascript" src="{{ bundleLink('js/common.js' ) }}"></script>
        <script type="text/javascript" src="{{ bundleLink('js/app.js') }}"></script>


@stop
