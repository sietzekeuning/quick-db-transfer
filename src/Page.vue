<template>
    <div>
        
        <div class="flex items-center justify-between h-16 p-6 bg-gray-200">
            <div id="nav">
                <router-link to="/">Home</router-link> |
                <router-link to="/connections">Connections</router-link>
            </div>

            <div>
                <slot name="buttons"></slot>
            </div>
        </div>

        <div class="p-6">
            <slot></slot>
        </div>

    </div>
</template>