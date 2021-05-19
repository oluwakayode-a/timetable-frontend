<template>
    <div class="page">
        <Table :id=$route.params.id />
    </div>
</template>

<script>
import Table from '@/components/Table'


export default {
    components: {
        Table
    }
}
</script>